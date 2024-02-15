import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedDataService } from '../shared-data-service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { WorkExperience } from '../interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workexperience',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './workexperience.component.html',
  styleUrl: './workexperience.component.css'
})
export class WorkexperienceComponent {
  emp_ID: number | null = null;
  view_mode: String | null = null;
  workexperience: WorkExperience[] = [];

  constructor(private router: Router, private sharedDataService: SharedDataService, private http: HttpClient) {
    this.emp_ID = this.sharedDataService.getEmployeeId();
    this.view_mode = sharedDataService.get_view_mode();
    this.getWorkExperience().then(() => {
    });
  }

  addedit(mode: String, experience_ID: number) {

    if (mode === 'add') {
    // Tells the target component that there will be new data, hence do not populate with existing data
    this.sharedDataService.set_isNewData(true);
    }
    else if (mode ==='edit'){
      // Tells the target component that there is existing data, hence populate with existing data
      this.sharedDataService.set_isNewData(false);
      this.sharedDataService.set_itemID(experience_ID);
    }

    this.router.navigate(['home/workexperience/edit-workexperience'])
  }

  deleteItem(experience_ID: number, company_name: String){
    if (confirm(`Are you sure you want to delete ${company_name}?`)){
      const postData = {
        'tbl': 'tbl_experience',
        'item_ID': experience_ID,
        'table_primary_key': 'experience_ID',
      };
      // Delete Dependencies
      return new Promise<void>((resolve, reject) => {
        this.http.post<WorkExperience>(`http://localhost:3000/deleteItem`, postData)
          .subscribe(
            (resultData) => {
              // Refreshes the current route if successful. Saves time from the user from clicking in and out
              const currentUrl = this.router.url;
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate([currentUrl]);
              });
              resolve();
            },
            error => {
              console.error("Error deleting dependencies item:", error);
              alert("Sum Ting Wong");
              reject(error);
            }
          );
      });
    } else {
      return false;
    }
  }

  getWorkExperience() {

    const postData = {
      'emp_ID': this.emp_ID,
      'page': 'workexperience',
    };

    // Get Employee Info
    return new Promise<void>((resolve, reject) => {
      this.http.post<WorkExperience[]>(`http://localhost:3000/read`, postData)
        .subscribe(
          (resultData: WorkExperience[]) => {
            // Set front end data taken from back end
            this.workexperience = resultData;
            resolve();
          },
          error => {
            console.error("Error fetching teaching loads:", error);
            alert("Sum Ting Wong");
            reject(error);
          }
        );
    });
  }
}
