import { CommonModule } from '@angular/common';
import { Component, NgIterable } from '@angular/core';
import { SharedDataService } from '../../shared-data-service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProvincialContact } from '../../interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-provincialcontact',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './provincialcontact.component.html',
  styleUrl: './provincialcontact.component.css'
})
export class ProvincialcontactComponent {
  emp_ID: number | null = null;
  view_mode: String | null = null;
  provincialcontact: ProvincialContact[] = [];

  constructor(private router: Router, private sharedDataService: SharedDataService, private http: HttpClient) {
    this.emp_ID = this.sharedDataService.getEmployeeId();
    this.view_mode = sharedDataService.get_view_mode();
    this.getProvincialContact().then(() => {
    });;
  }
  addedit(mode: String, provincial_ID: number) {

    if (mode === 'add') {
    // Tells the target component that there will be new data, hence do not populate with existing data
    this.sharedDataService.set_isNewData(true);
    }
    else if (mode ==='edit'){
      // Tells the target component that there is existing data, hence populate with existing data
      this.sharedDataService.set_isNewData(false);
      this.sharedDataService.set_itemID(provincial_ID);
    }

    this.router.navigate(['home/provincialcontact/edit-provincialcontact'])
  }

  deleteItem(provincial_ID: number, provincial_add: String, provincial_phone: String){
    if (confirm(`Are you sure you want to delete ${provincial_add} | ${provincial_phone}?`)){
      const postData = {
        'tbl': 'tbl_provincial_contact',
        'item_ID': provincial_ID,
        'table_primary_key': 'provincial_ID',
      };
      // Delete Provincial
      return new Promise<void>((resolve, reject) => {
        this.http.post<ProvincialContact>(`http://localhost:3000/deleteItem`, postData)
          .subscribe(
            (resultData) => {
              // Set front end data taken from back end
              this.router.navigate(['home/provincialcontact'])
              resolve();
            },
            error => {
              console.error("Error deleting provincial item:", error);
              alert("Sum Ting Wong");
              reject(error);
            }
          );
      });
    } else {
      return false;
    }
  }

  getProvincialContact() {

    const postData = {
      'emp_ID': this.emp_ID,
      'page': 'provincialcontact',
    };

    // Get Accounting Details
    return new Promise<void>((resolve, reject) => {
      this.http.post<ProvincialContact[]>(`http://localhost:3000/read`, postData)
        .subscribe(
          (resultData: ProvincialContact[]) => {
            // Set front end data taken from back end
            this.provincialcontact = resultData;
            resolve();
          },
          error => {
            console.error("Error fetching provincial contact:", error);
            alert("Sum Ting Wong");
            reject(error);
          }
        );
    });
  }
}
