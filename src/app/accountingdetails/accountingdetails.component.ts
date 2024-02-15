import { Component } from '@angular/core';
import { SharedDataService } from '../shared-data-service';
import { AccountingDetails } from '../interfaces';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accountingdetails',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './accountingdetails.component.html',
  styleUrl: './accountingdetails.component.css'
})
export class AccountingdetailsComponent {
  emp_ID: number | null = null;
  view_mode: String | null = null;
  accountingdetails: AccountingDetails | null = null;

  constructor(private router: Router, private sharedDataService: SharedDataService, private http: HttpClient) {
    this.emp_ID = this.sharedDataService.getEmployeeId();
    this.view_mode = sharedDataService.get_view_mode();
    this.getEmployeeInfo().then(() => {
    });;
  }

  addedit() { this.router.navigate(['home/accountingdetails/edit-accountingdetails']) }

  delete() {
    if (confirm(`Are you sure you want to delete your accounting details?`)) {
      const editData = {
        'tbl': 'tbl_accounting_details',
        'emp_ID': this.emp_ID,
        'sss_no': '',
        'tax_no': '',
        'pagibig_no': '',
        'philhealth_no': '',
      };

      this.http.put<any>(`http://localhost:3000/delete`, editData)
        .subscribe(
          (resultData) => {
            // Refreshes the current route if successful. Saves time from the user from clicking in and out
            const currentUrl = this.router.url;
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate([currentUrl]);
            });
          },
          error => {
            console.error("Something went wrong:", error);
          }
        )
    }

  }

  getEmployeeInfo() {

    const postData = {
      'emp_ID': this.emp_ID,
      'page': 'accountingdetails',
    };

    // Get Accounting Details
    return new Promise<void>((resolve, reject) => {
      this.http.post<AccountingDetails>(`http://localhost:3000/read`, postData)
        .subscribe(
          (resultData: AccountingDetails) => {
            // Set front end data taken from back end
            this.accountingdetails = resultData;
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
