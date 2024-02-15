import { Component } from '@angular/core';
import { SharedDataService } from '../../shared-data-service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Emergency } from '../../interfaces';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-emergency',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './emergency.component.html',
  styleUrl: './emergency.component.css'
})
export class EmergencyComponent {
  emp_ID: number | null = null;
  view_mode: String | null = null;
  emergency: Emergency | null = null;

  constructor(private router: Router, private sharedDataService: SharedDataService, private http: HttpClient) {
    this.emp_ID = this.sharedDataService.getEmployeeId();
    this.view_mode = sharedDataService.get_view_mode();
    this.getEmergency().then(() => {
    });;
  }

  addedit() { this.router.navigate(['home/emergencycontact/edit-emergencycontact']) }

  delete() {
    if (confirm(`Are you sure you want to delete your emergency contact?`)) {
      const editData = {
        'tbl': 'tbl_emergency',
        'emp_ID': this.emp_ID,
        'contact_person': '',
        'relationship': '',
        'home_phone_no': '',
        'mobile_phone_no': '',
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
