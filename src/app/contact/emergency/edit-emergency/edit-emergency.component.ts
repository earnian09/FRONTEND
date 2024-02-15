import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedDataService } from '../../../shared-data-service';
import { Emergency } from '../../../interfaces';

@Component({
  selector: 'app-edit-emergency',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule],
  templateUrl: './edit-emergency.component.html',
  styleUrl: './edit-emergency.component.css'
})
export class EditEmergencyComponent {
  emp_ID: number | null = null;
  emergency: Emergency | null = null;
  editForm!: FormGroup;

  constructor(private router: Router, private sharedDataService: SharedDataService, private formBuilder: FormBuilder, private http: HttpClient) {
    this.emp_ID = this.sharedDataService.getEmployeeId();

    this.getEmergency().then(() => {
      this.initForm();
    });
  }
  
  ngOnInit() {
    if (!this.editForm) {
      this.initForm();
    }
  }
  initForm(){

    this.editForm = this.formBuilder.group({
      contact_person: [this.emergency?.contact_person, Validators.required],
      relationship: [this.emergency?.relationship, Validators.required],
      home_phone_no: [this.emergency?.home_phone_no, Validators.required],
      mobile_phone_no: [this.emergency?.mobile_phone_no, Validators.required],
    });
  }

  confirm() {
    const editData = {
      'tbl': 'tbl_emergency',
      'emp_ID': this.emp_ID,
      'contact_person': this.editForm.get('contact_person')!.value,
      'relationship': this.editForm.get('relationship')!.value,
      'home_phone_no': this.editForm.get('home_phone_no')!.value,
      'mobile_phone_no': this.editForm.get('mobile_phone_no')!.value,
    };

    this.http.put<any>(`http://localhost:3000/update`, editData)
      .subscribe(
        (resultData) => {
          this.router.navigate(['home/emergencycontact'])
        },
        error => {
          console.error("Something went wrong:", error);
        }
      )
  }
  cancel() { this.router.navigate(['home/emergencycontact']) }
  
  getEmergency() {

    const postData = {
      'emp_ID': this.emp_ID,
      'page': 'emergency',
    };

    // Get Accounting Details
    return new Promise<void>((resolve, reject) => {
      this.http.post<Emergency>(`http://localhost:3000/read`, postData)
        .subscribe(
          (resultData: Emergency) => {
            // Set front end data taken from back end
            this.emergency = resultData;
            resolve();
          },
          error => {
            console.error("Error fetching emergency contact:", error);
            alert("Sum Ting Wong");
            reject(error);
          }
        );
    });
  }
}
