import { Component } from '@angular/core';
import { SharedDataService } from '../shared-data-service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Education } from '../interfaces';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './education.component.html',
  styleUrl: './education.component.css'
})
export class EducationComponent {
  emp_ID: number | null = null;
  view_mode: String | null = null;
  education: Education | null = null;

  constructor(private router: Router, private sharedDataService: SharedDataService, private http: HttpClient) {
    this.emp_ID = this.sharedDataService.getEmployeeId();
    this.view_mode = sharedDataService.get_view_mode();
    this.getEducation().then(() => {
      console.log(this.education);
    });;
  }

  addedit() { this.router.navigate(['home/education/edit-education']) }

  delete() { 
    const editData = {
      'tbl': 'tbl_education',
      'emp_ID': this.emp_ID,
      'bac_school': '',
      'bac_grad_date': '',
      'mas_school': '',
      'mas_grad_date': '',
      'doc_school': '',
      'doc_grad_date': '',
      'prof_lic': '',
      'lic_ID': ''
    };

    this.http.put<any>(`http://localhost:3000/delete`, editData)
      .subscribe(
        (resultData) => {
          this.router.navigate(['home/education'])
        },
        error => {
          console.error("Something went wrong:", error);
        }
      )
  }

  getEducation() {

    const postData = {
      'emp_ID': this.emp_ID,
      'page': 'education',
    };

    // Get Accounting Details
    return new Promise<void>((resolve, reject) => {
      this.http.post<Education>(`http://localhost:3000/read`, postData)
        .subscribe(
          (resultData: Education) => {
            // Set front end data taken from back end
            this.education = resultData;
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
