import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedDataService } from '../shared-data-service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TeachingLoads } from '../interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teachingloads',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './teachingloads.component.html',
  styleUrl: './teachingloads.component.css'
})
export class TeachingloadsComponent {
  emp_ID: number | null = null;
  view_mode: String | null = null;
  teachingloads: TeachingLoads[] = [];

  constructor(private router: Router, private sharedDataService: SharedDataService, private http: HttpClient) {
    this.emp_ID = this.sharedDataService.getEmployeeId();
    this.view_mode = sharedDataService.get_view_mode();
    this.getTeachingLoads().then(() => {
    });
  }

  addedit(mode: String, teachingloads_ID: number) {

    if (mode === 'add') {
    // Tells the target component that there will be new data, hence do not populate with existing data
    this.sharedDataService.set_isNewData(true);
    }
    else if (mode ==='edit'){
      // Tells the target component that there is existing data, hence populate with existing data
      this.sharedDataService.set_isNewData(false);
      this.sharedDataService.set_itemID(teachingloads_ID);
    }

    this.router.navigate(['home/teachingloads/edit-teachingloads'])
  }

  deleteItem(
    teachingloads_ID: number,
    acad_year: String,
    sem: String,
    sub_taught: String,
    ){
    if (confirm(`Are you sure you want to delete ${acad_year} | ${sem} | ${sub_taught}?`)){
      const postData = {
        'tbl': 'tbl_teaching_loads',
        'item_ID': teachingloads_ID,
        'table_primary_key': 'teachingloads_ID',
      };
      // Delete teachingloads
      return new Promise<void>((resolve, reject) => {
        this.http.post<TeachingLoads>(`http://localhost:3000/deleteItem`, postData)
          .subscribe(
            (resultData) => {
              // Set front end data taken from back end
              this.router.navigate(['home/teachingloads'])
              resolve();
            },
            error => {
              console.error("Error deleting teachingloads item:", error);
              alert("Sum Ting Wong");
              reject(error);
            }
          );
      });
    } else {
      return false;
    }
  }

  getTeachingLoads() {

    const postData = {
      'emp_ID': this.emp_ID,
      'page': 'teachingloads',
    };
    
    // Get Employee Info
    return new Promise<void>((resolve, reject) => {
      this.http.post<TeachingLoads[]>(`http://localhost:3000/read`, postData)
        .subscribe(
          (resultData: TeachingLoads[]) => {
            // Set front end data taken from back end
            this.teachingloads = resultData;
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
