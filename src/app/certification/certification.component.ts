import { Component } from '@angular/core';
import { SharedDataService } from '../shared-data-service';
import { Certification } from '../interfaces';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-certification',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './certification.component.html',
  styleUrl: './certification.component.css'
})
export class CertificationComponent {
  emp_ID: number | null = null;
  view_mode: String | null = null;
  certification: Certification[] = [];

  constructor(private router: Router, private sharedDataService: SharedDataService, private http: HttpClient) {
    this.emp_ID = this.sharedDataService.getEmployeeId();
    this.view_mode = sharedDataService.get_view_mode();
    this.getCertifiction().then(() => {
    });
  }

  addedit(mode: String, cert_ID: number) {

    if (mode === 'add') {
    // Tells the target component that there will be new data, hence do not populate with existing data
    this.sharedDataService.set_isNewData(true);
    }
    else if (mode ==='edit'){
      // Tells the target component that there is existing data, hence populate with existing data
      this.sharedDataService.set_isNewData(false);
      this.sharedDataService.set_itemID(cert_ID);
    }

    this.router.navigate(['home/certification/edit-certification'])
  }

  deleteItem(cert_ID: number, cert_title: String){
    if (confirm(`Are you sure you want to delete ${cert_title}?`)){
      const postData = {
        'tbl': 'tbl_certification',
        'item_ID': cert_ID,
        'table_primary_key': 'cert_ID',
      };
      // Delete Dependencies
      return new Promise<void>((resolve, reject) => {
        this.http.post<Certification>(`http://localhost:3000/deleteItem`, postData)
          .subscribe(
            (resultData) => {
              // Set front end data taken from back end
              this.router.navigate(['home/certification'])
              resolve();
            },
            error => {
              console.error("Error deleting certificaion item:", error);
              alert("Sum Ting Wong");
              reject(error);
            }
          );
      });
    } else {
      return false;
    }
  }

  // decision is approve or deny
  approveordeny(decision: String, cert_ID: number, cert_title: String){
    if (confirm(`Are you sure you want to ${decision} ${cert_title}?`)){
      let newStatus = '';
      if (decision == 'approve') {
        newStatus = 'Approved';
      }
      else if (decision == 'deny') {
        newStatus = 'Denied';
      }
      const postData = {
        'tbl': 'tbl_certification',
        'item_ID': cert_ID,
        'mode': 'edit',
        'table_primary_key': 'cert_ID',
        'status': newStatus
      };      

      // Update Status
      return new Promise<void>((resolve, reject) => {
        this.http.put<Certification>(`http://localhost:3000/updateItem`, postData)
          .subscribe(
            (resultData) => {
              // Set front end data taken from back end
              this.router.navigate(['home/certification'])
              resolve();
            },
            error => {
              console.error("Error updating certificaion item:", error);
              alert("Sum Ting Wong");
              reject(error);
            }
          );
      });
    } else {
      return false;
    }
  }

  getCertifiction() {

    const postData = {
      'emp_ID': this.emp_ID,
      'page': 'certification',
    };

    // Get Certification
    return new Promise<void>((resolve, reject) => {
      this.http.post<Certification[]>(`http://localhost:3000/read`, postData)
        .subscribe(
          (resultData: Certification[]) => {
            // Set front end data taken from back end
            this.certification = resultData;
            resolve();
          },
          error => {
            console.error("Error fetching certification:", error);
            alert("Sum Ting Wong");
            reject(error);
          }
        );
    });
  }

  // Displays whether or not a status exists.
  // Ex: No item in the certification list has a status of approved, hence don't show it
  statusExists(status:String) {
    return this.certification.some(c => c['status'] === status);
  }

}
