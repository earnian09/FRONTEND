import { Component } from '@angular/core';
import { SharedDataService } from '../shared-data-service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { EmployeeInformation } from '../interfaces';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './info.component.html',
  styleUrl: './info.component.css'
})
export class InfoComponent {
  emp_ID: number | null = null;
  view_mode: String | null = null;
  employeeInformation: EmployeeInformation | null = null;

  constructor(private router: Router, private sharedDataService: SharedDataService, private http: HttpClient) {
    // This is to 
    this.emp_ID = this.sharedDataService.getEmployeeId();
    this.view_mode = sharedDataService.get_view_mode();
    this.getEmployeeInfo()
  }

  addedit() { this.router.navigate(['home/employeeinformation/edit-information']) }

  delete() {
    if (confirm(`Are you sure you want to delete your information?`)) {
      const editData = {
        'tbl': 'tbl_info',
        'emp_ID': this.emp_ID,
        'emp_name': '',
        'emp_nickname': '',
        'emp_gender': '',
        'emp_maiden_name': '',
        'emp_sss_fName': '',
        'emp_dob': '',
        'emp_pob': '',
        'emp_cStatus': '',
        'emp_religion': '',
        'emp_blood_type': '',
        'no_of_loads': '',
        'rest_day': '',
        'emp_address': ''
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
