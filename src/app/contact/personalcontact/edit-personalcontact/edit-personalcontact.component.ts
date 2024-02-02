import { Component } from '@angular/core';
import { PersonalContact } from '../../../interfaces';
import { Router } from '@angular/router';
import { SharedDataService } from '../../../shared-data-service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-personalcontact',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule],
  templateUrl: './edit-personalcontact.component.html',
  styleUrl: './edit-personalcontact.component.css'
})
export class EditPersonalcontactComponent {
  emp_ID: number | null = null;
  personalcontact: PersonalContact | null = null;
  editForm!: FormGroup;

  constructor(private router: Router, private sharedDataService: SharedDataService, private formBuilder: FormBuilder, private http: HttpClient) {
    this.emp_ID = this.sharedDataService.getEmployeeId();

    this.getPersonalContact().then(() => {
      this.editForm = this.formBuilder.group({
        present_add: [this.personalcontact?.present_add, Validators.required],
        home_phone: [this.personalcontact?.home_phone, Validators.required],
        mobile_phone: [this.personalcontact?.mobile_phone, Validators.required],
        email_add_1: [this.personalcontact?.email_add_1, Validators.required],
        email_add_2: [this.personalcontact?.email_add_2, Validators.required],
      });
    });;
  }

  confirm() {
    const editData = {
      'tbl': 'tbl_personal_contact',
      'emp_ID': this.emp_ID,
      'present_add': this.editForm.get('present_add')!.value,
      'home_phone': this.editForm.get('home_phone')!.value,
      'mobile_phone': this.editForm.get('mobile_phone')!.value,
      'email_add_1': this.editForm.get('email_add_1')!.value,
      'email_add_2': this.editForm.get('email_add_2')!.value,
    };

    this.http.put<any>(`http://localhost:3000/update`, editData)
      .subscribe(
        (resultData) => {
          this.router.navigate(['home/personalcontact'])
        },
        error => {
          console.error("Something went wrong:", error);
        }
      )
  }
  cancel() { this.router.navigate(['home/personalcontact']) }
  getPersonalContact() {

    const postData = {
      'emp_ID': this.emp_ID,
      'page': 'personalcontact',
    };

    // Get Accounting Details
    return new Promise<void>((resolve, reject) => {
      this.http.post<PersonalContact>(`http://localhost:3000/read`, postData)
        .subscribe(
          (resultData: PersonalContact) => {
            // Set front end data taken from back end
            this.personalcontact = resultData;
            resolve();
          },
          error => {
            console.error("Error fetching personal contact:", error);
            alert("Sum Ting Wong");
            reject(error);
          }
        );
    });
  }
}
