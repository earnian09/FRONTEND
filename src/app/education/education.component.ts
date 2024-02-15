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
    });;
  }

  addedit(degree: String) {
    this.sharedDataService.set_Degree(degree);
    this.router.navigate(['home/education/edit-education'])
  }

  delete(degree: String) {

    let editData = {
      'tbl': 'tbl_education',
      'emp_ID': this.emp_ID,
      'bac_school': this.education?.bac_school,
      'bac_grad_date': this.education?.bac_grad_date,
      'mas_school': this.education?.mas_school,
      'mas_grad_date': this.education?.mas_grad_date,
      'doc_school': this.education?.doc_school,
      'doc_grad_date': this.education?.doc_grad_date,
      'prof_lic': this.education?.prof_lic,
      'lic_ID': this.education?.lic_ID
    };
    // Used for delete confirmation
    let questionValue: String | null = null

    switch (degree) {
      case 'bac':
        console.log(degree);
        questionValue = this.education!.bac_school;
        editData['bac_school'] = '';
        editData['bac_grad_date'] = '';
        break;
      case 'mas':
        console.log(degree);
        questionValue = this.education!.mas_school;
        editData['mas_school'] = '';
        editData['mas_grad_date'] = '';
        break;
      case 'doc':
        console.log(degree);
        questionValue = this.education!.doc_school;
        editData['doc_school'] = '';
        editData['doc_grad_date'] = '';
        break;
      case 'lic':
        console.log(degree);
        questionValue = 'Licences';
        editData['prof_lic'] = '';
        editData['lic_ID'] = 0;
        break;
    }

    if (confirm(`Are you sure you want to delete ${questionValue}?`)) {
      this.http.put<any>(`http://localhost:3000/update`, editData)
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
