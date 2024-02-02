import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedDataService } from '../shared-data-service';
import { Organizations } from '../interfaces';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-organization',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './organization.component.html',
  styleUrl: './organization.component.css'
})
export class OrganizationComponent {
  emp_ID: number | null = null;
  view_mode: String | null = null;
  organizations: Organizations[] = [];

  constructor(private router: Router, private sharedDataService: SharedDataService, private http: HttpClient) {
    this.emp_ID = this.sharedDataService.getEmployeeId();
    this.view_mode = sharedDataService.get_view_mode();
    this.getOrganizations().then(() => {
    });

  }

  addedit(mode: String, org_ID: number) {
    if (mode === 'add') {
      // Tells the target component that there will be new data, hence do not populate with existing data
      this.sharedDataService.set_isNewData(true);
    }
    else if (mode === 'edit') {
      // Tells the target component that there is existing data, hence populate with existing data
      this.sharedDataService.set_isNewData(false);
      this.sharedDataService.set_itemID(org_ID);
    }

    this.router.navigate(['home/organization/edit-organization'])
  }

  deleteItem(org_ID: number, org_name: String) {
    if (confirm(`Are you sure you want to delete ${org_name}?`)) {
      const postData = {
        'tbl': 'tbl_org',
        'item_ID': org_ID,
        'table_primary_key': 'org_ID',
      };
      // Delete Dependencies
      return new Promise<void>((resolve, reject) => {
        this.http.post<Organizations>(`http://localhost:3000/deleteItem`, postData)
          .subscribe(
            (resultData) => {
              // Set front end data taken from back end
              this.router.navigate(['home/organization'])
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

  getOrganizations() {
    const postData = {
      'emp_ID': this.emp_ID,
      'page': 'organizations',
    };

    // Get Employee Info
    return new Promise<void>((resolve, reject) => {
      this.http.post<Organizations[]>(`http://localhost:3000/read`, postData)
        .subscribe(
          (resultData: Organizations[]) => {
            // Set front end data taken from back end

            this.organizations = resultData;
            resolve();
          },
          error => {
            console.error("Error fetching organizaitons:", error);
            alert("Sum Ting Wong");
            reject(error);
          }
        );
    });
  }

}
