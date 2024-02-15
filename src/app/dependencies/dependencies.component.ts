import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedDataService } from '../shared-data-service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Dependencies } from '../interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dependencies',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './dependencies.component.html',
  styleUrl: './dependencies.component.css'
})
export class DependenciesComponent {
  emp_ID: number | null = null;
  view_mode: String | null = null;
  dependencies: Dependencies[] = [];

  constructor(private router: Router, private sharedDataService: SharedDataService, private http: HttpClient) {
    this.emp_ID = this.sharedDataService.getEmployeeId();
    this.view_mode = sharedDataService.get_view_mode();
    this.getDependencies().then(() => {
    });
  }

  addedit(mode: String, dependencies_ID: number) {

    if (mode === 'add') {
    // Tells the target component that there will be new data, hence do not populate with existing data
    this.sharedDataService.set_isNewData(true);
    }
    else if (mode ==='edit'){
      // Tells the target component that there is existing data, hence populate with existing data
      this.sharedDataService.set_isNewData(false);
      this.sharedDataService.set_itemID(dependencies_ID);
    }

    this.router.navigate(['home/dependencies/edit-dependencies'])
  }

  deleteItem(dependencies_ID: number, f_name: String){
    if (confirm(`Are you sure you want to delete ${f_name}?`)){
      const postData = {
        'tbl': 'tbl_dependencies',
        'item_ID': dependencies_ID,
        'table_primary_key': 'dependencies_ID',
      };
      // Delete Dependencies
      return new Promise<void>((resolve, reject) => {
        this.http.post<Dependencies>(`http://localhost:3000/deleteItem`, postData)
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

  getDependencies() {

    const postData = {
      'emp_ID': this.emp_ID,
      'page': 'dependencies',
    };

    // Get Dependencies
    return new Promise<void>((resolve, reject) => {
      this.http.post<Dependencies[]>(`http://localhost:3000/read`, postData)
        .subscribe(
          (resultData: Dependencies[]) => {
            // Set front end data taken from back end
            this.dependencies = resultData;
            resolve();
          },
          error => {
            console.error("Error fetching dependencies:", error);
            alert("Sum Ting Wong");
            reject(error);
          }
        );
    });
  }

}
