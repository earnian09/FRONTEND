import { Component } from '@angular/core';
import { SharedDataService } from '../../shared-data-service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AccountingDetails } from '../../interfaces';

@Component({
  selector: 'app-edit-accountingdetails',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule],
  templateUrl: './edit-accountingdetails.component.html',
  styleUrl: './edit-accountingdetails.component.css'
})
export class EditAccountingdetailsComponent {
  emp_ID: number | null = null;
  accountingdetails: AccountingDetails | null = null;
  editForm!: FormGroup;

  constructor(private sharedDataService: SharedDataService, private router: Router, private formBuilder: FormBuilder, private http: HttpClient) {
    this.emp_ID = this.sharedDataService.getEmployeeId();
    this.getEmployeeInfo().then(() => {
      this.editForm = this.formBuilder.group({
        sss_no: [this.accountingdetails?.sss_no, Validators.required],
        tax_no: [this.accountingdetails?.tax_no, Validators.required],
        pagibig_no: [this.accountingdetails?.pagibig_no, Validators.required],
        philhealth_no: [this.accountingdetails?.philhealth_no, Validators.required],
      });
    });
  }
  confirm() {
    const editData = {
      'tbl': 'tbl_accounting_details',
      'emp_ID': this.emp_ID,
      'sss_no': this.editForm.get('sss_no')!.value,
      'tax_no': this.editForm.get('tax_no')!.value,
      'pagibig_no': this.editForm.get('pagibig_no')!.value,
      'philhealth_no': this.editForm.get('philhealth_no')!.value,
    };

    this.http.put<any>(`http://localhost:3000/update`, editData)
      .subscribe(
        (resultData) => {
          this.router.navigate(['home/accountingdetails'])
        },
        error => {
          console.error("Something went wrong:", error);
        }
      )
  }

  cancel(){
    this.router.navigate(['home/accountingdetails'])
  }
  getEmployeeInfo() {

    const postData = {
      'emp_ID': this.emp_ID,
      'page': 'accountingdetails',
    };

    // Get Employee Info
    return new Promise<void>((resolve, reject) => {
      this.http.post<AccountingDetails>(`http://localhost:3000/read`, postData)
        .subscribe(
          (resultData: AccountingDetails) => {
            // Set front end data taken from back end
            this.accountingdetails = resultData;
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
