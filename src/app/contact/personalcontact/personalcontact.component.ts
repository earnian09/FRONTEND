import { Component } from '@angular/core';
import { SharedDataService } from '../../shared-data-service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PersonalContact } from '../../interfaces';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-personalcontact',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './personalcontact.component.html',
  styleUrl: './personalcontact.component.css'
})
export class PersonalcontactComponent {
  emp_ID: number | null = null;
  view_mode: String | null = null;
  personalcontact: PersonalContact | null = null;

  constructor(private router: Router, private sharedDataService: SharedDataService, private http: HttpClient) {
    this.emp_ID = this.sharedDataService.getEmployeeId();
    this.view_mode = sharedDataService.get_view_mode();
    this.getPersonalContact().then(() => {
    });;
  }

  addedit() { this.router.navigate(['home/personalcontact/edit-personalcontact']) }

  delete() {
    if (confirm(`Are you sure you want to delete your personal contact?`)) {
      const editData = {
        'tbl': 'tbl_personal_contact',
        'emp_ID': this.emp_ID,
        'present_add': '',
        'home_phone': '',
        'mobile_phone': '',
        'email_add_1': '',
        'email_add_2': '',
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
