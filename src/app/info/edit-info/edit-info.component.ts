import { Component, LOCALE_ID } from '@angular/core';
import { SharedDataService } from '../../shared-data-service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { EmployeeInformation } from '../../interfaces';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule],
  templateUrl: './edit-info.component.html',
  styleUrl: './edit-info.component.css'
})

export class EditInformation {
  emp_ID: number | null = null;
  employeeInformation: EmployeeInformation | null = null;
  editForm!: FormGroup;

  constructor(private sharedDataService: SharedDataService, private router: Router, private formBuilder: FormBuilder, private http: HttpClient) {
    this.emp_ID = this.sharedDataService.getEmployeeId();
    this.getEmployeeInfo().then(() => {
      this.initForm();
    });
  }
  // Initialize form after getEmployeeInfo has occured. Add values to form inputs
  ngOnInit() {
    if (!this.editForm) {
      this.initForm();
    }
  }

  initForm(){
    this.editForm = this.formBuilder.group({
      emp_name: [this.employeeInformation?.emp_name, Validators.required],
      emp_nickname: [this.employeeInformation?.emp_nickname, Validators.required],
      emp_gender: [this.employeeInformation?.emp_gender, Validators.required],
      emp_maiden_name: [this.employeeInformation?.emp_maiden_name, Validators.required],
      emp_sss_fName: [this.employeeInformation?.emp_sss_fName, Validators.required],
      emp_dob: [this.employeeInformation?.emp_dob, Validators.required],
      emp_pob: [this.employeeInformation?.emp_pob, Validators.required],
      emp_cStatus: [this.employeeInformation?.emp_cStatus, Validators.required],
      emp_religion: [this.employeeInformation?.emp_religion, Validators.required],
      emp_blood_type: [this.employeeInformation?.emp_blood_type, Validators.required],
      no_of_loads: [this.employeeInformation?.no_of_loads, Validators.required],
      rest_day: [this.employeeInformation?.rest_day, Validators.required],
      emp_address: [this.employeeInformation?.emp_address, Validators.required]
    });
  }

  // Confirm Edits, execute editing
  confirm() {

    const editData = {
      'tbl': 'tbl_info',
      'emp_ID': this.emp_ID,
      'emp_name': this.editForm.get('emp_name')!.value,
      'emp_nickname': this.editForm.get('emp_nickname')!.value,
      'emp_gender': this.editForm.get('emp_gender')!.value,
      'emp_maiden_name': this.editForm.get('emp_maiden_name')!.value,
      'emp_sss_fName': this.editForm.get('emp_sss_fName')!.value,
      'emp_dob': this.editForm.get('emp_dob')!.value,
      'emp_pob': this.editForm.get('emp_pob')!.value,
      'emp_cStatus': this.editForm.get('emp_cStatus')!.value,
      'emp_religion': this.editForm.get('emp_religion')!.value,
      'emp_blood_type': this.editForm.get('emp_blood_type')!.value,
      'no_of_loads': this.editForm.get('no_of_loads')!.value,
      'rest_day': this.editForm.get('rest_day')!.value,
      'emp_address': this.editForm.get('emp_address')!.value
    };

    // Handles date being null, replaces with empty string to avoid errors
    editData.emp_dob ??= '';

    this.http.put<any>(`http://localhost:3000/update`, editData)
      .subscribe(
        (resultData) => {
          this.router.navigate(['home/employeeinformation'])
        },
        error => {
          console.error("Something went wrong:", error);
        }
      )
  }

  cancel() {
    this.router.navigate(['home/employeeinformation'])
  }

  getEmployeeInfo() {

    const postData = {
      'emp_ID': this.emp_ID,
      'page': 'employeeinfo',
    };

    // Get Employee Info
    return new Promise<void>((resolve, reject) => {
      this.http.post<EmployeeInformation>(`http://localhost:3000/read`, postData)
        .subscribe(
          (resultData: EmployeeInformation) => {
            // Set front end data taken from back end
            this.employeeInformation = resultData;
            resolve();
          },
          error => {
            console.error("Error fetching employee info:", error);
            alert("Sum Ting Wong");
            reject(error);
          }
        );
    });
  }

}
