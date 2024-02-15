import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Skills } from '../interfaces';
import { SharedDataService } from '../shared-data-service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.css'
})
export class SkillsComponent {
  emp_ID: number | null = null;
  view_mode: String | null = null;
  skills: Skills[] = [];
  
  constructor(private router: Router, private sharedDataService: SharedDataService, private http: HttpClient) {
    this.emp_ID = this.sharedDataService.getEmployeeId();
    this.view_mode = sharedDataService.get_view_mode();
    this.getSkills().then(() => {
    });
  }

  addedit(mode: String, skills_ID: number) {

    if (mode === 'add') {
    // Tells the target component that there will be new data, hence do not populate with existing data
    this.sharedDataService.set_isNewData(true);
    }
    else if (mode ==='edit'){
      // Tells the target component that there is existing data, hence populate with existing data
      this.sharedDataService.set_isNewData(false);
      this.sharedDataService.set_itemID(skills_ID);
    }

    this.router.navigate(['home/skills/edit-skills'])
  }

  deleteItem(skills_ID: number, skills: String){
    if (confirm(`Are you sure you want to delete ${skills}?`)){
      const postData = {
        'tbl': 'tbl_skills',
        'item_ID': skills_ID,
        'table_primary_key': 'skills_ID',
      };
      // Delete Skills
      return new Promise<void>((resolve, reject) => {
        this.http.post<Skills>(`http://localhost:3000/deleteItem`, postData)
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
              console.error("Error deleting skill item:", error);
              alert("Sum Ting Wong");
              reject(error);
            }
          );
      });
    } else {
      return false;
    }
  }


  getSkills() {

    const postData = {
      'emp_ID': this.emp_ID,
      'page': 'skills',
    };

    // Get Skills
    return new Promise<void>((resolve, reject) => {
      this.http.post<Skills[]>(`http://localhost:3000/read`, postData)
        .subscribe(
          (resultData: Skills[]) => {
            // Set front end data taken from back end
            this.skills = resultData;
            resolve();
          },
          error => {
            console.error("Error fetching Skills:", error);
            alert("Sum Ting Wong");
            reject(error);
          }
        );
    });
  }

}
