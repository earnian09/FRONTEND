import { Component } from '@angular/core';
import { SharedDataService } from '../shared-data-service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { EmployeeDetails } from '../interfaces';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employeedetails',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './employeedetails.component.html',
  styleUrl: './employeedetails.component.css'
})
export class EmployeedetailsComponent {
  emp_ID: number | null = null;
  view_mode: String | null = null;
  employeedetails: EmployeeDetails | null = null;

  constructor(private router: Router, private sharedDataService: SharedDataService, private http: HttpClient) {
    this.emp_ID = this.sharedDataService.getEmployeeId();
    this.view_mode = sharedDataService.get_view_mode();
    this.getEmployeeDetails().then(() => {
    });

  }

  addedit() { this.router.navigate(['home/employeedetails/edit-employeedetails']) }

  delete() {
    if (confirm(`Are you sure you want to delete your details?`)) {
      const editData = {
        'tbl': 'tbl_details',
        'emp_ID': this.emp_ID,
        'department': '',
        'date_hire': '',
        'emp_type': '',
        'teaching_class': '',
        'status': '',
        'date_regularized': '',
        'time_stamp': '',
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
