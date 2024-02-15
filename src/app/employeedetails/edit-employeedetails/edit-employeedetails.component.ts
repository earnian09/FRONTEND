import { Component } from '@angular/core';
import { EmployeeDetails } from '../../interfaces';
import { Router } from '@angular/router';
import { SharedDataService } from '../../shared-data-service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-employeedetails',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule],
  templateUrl: './edit-employeedetails.component.html',
  styleUrl: './edit-employeedetails.component.css'
})
export class EditEmployeedetailsComponent {
  emp_ID: number | null = null;
  employeedetails: EmployeeDetails | null = null;
  editForm!: FormGroup;

  constructor(private router: Router, private sharedDataService: SharedDataService, private formBuilder: FormBuilder, private http: HttpClient) {
    this.emp_ID = this.sharedDataService.getEmployeeId();
    this.getEmployeeDetails().then(() => {
      this.initForm();
    });
  }

  ngOnInit() {
    if (!this.editForm) {
      this.initForm();
    }
  }

  initForm() {
    this.editForm = this.formBuilder.group({
      emp_ID: [this.employeedetails?.emp_ID, Validators.required],
      department: [this.employeedetails?.department, Validators.required],
      date_hire: [this.employeedetails?.date_hire, Validators.required],
      emp_type: [this.employeedetails?.emp_type, Validators.required],
      teaching_class: [this.employeedetails?.teaching_class, Validators.required],
      status: [this.employeedetails?.status, Validators.required],
      date_regularized: [this.employeedetails?.date_regularized, Validators.required],
      time_stamp: [this.employeedetails?.time_stamp, Validators.required],
    });
  }

  confirm() {
    const editData = {
      'tbl': 'tbl_details',
      'emp_ID': this.emp_ID,
      'department': this.editForm.get('department')!.value,
      'date_hire': this.editForm.get('date_hire')!.value,
      'emp_type': this.editForm.get('emp_type')!.value,
      'teaching_class': this.editForm.get('teaching_class')!.value,
      'status': this.editForm.get('status')!.value,
      'date_regularized': this.editForm.get('date_regularized')!.value,
      'time_stamp': this.editForm.get('time_stamp')!.value,
    };

    // Handles date being null, replaces with empty string to avoid errors
    editData.date_hire ??= '';
    editData.date_regularized ??= '';
    editData.time_stamp ??= '';

    this.http.put<any>(`http://localhost:3000/update`, editData)
      .subscribe(
        (resultData) => {
          this.router.navigate(['home/employeedetails'])
        },
        error => {
          console.error("Something went wrong:", error);
        }
      )
  }

  cancel() { this.router.navigate(['home/employeedetails'])}

  getEmployeeDetails() {

    const postData = {
      'emp_ID': this.emp_ID,
      'page': 'employeedetails',
    };

    // Get Accounting Details
    return new Promise<void>((resolve, reject) => {
      this.http.post<EmployeeDetails>(`http://localhost:3000/read`, postData)
        .subscribe(
          (resultData: EmployeeDetails) => {
            // Set front end data taken from back end
            this.employeedetails = resultData;
            resolve();
          },
          error => {
            console.error("Error fetching accounting details:", error);
            alert("Sum Ting Wong");
            reject(error);
          }
        );
    });
  }
}
