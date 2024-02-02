import { Component } from '@angular/core';
import { SharedDataService } from '../../shared-data-service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Organizations } from '../../interfaces';

@Component({
  selector: 'app-edit-organization',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './edit-organization.component.html',
  styleUrl: './edit-organization.component.css'
})
export class EditOrganizationComponent {
  emp_ID: number | null = null;
  organizationsItem: Organizations | null = null;
  isNewData: Boolean | null = null
  org_ID: number | null = null; // Gets primary key
  editForm!: FormGroup;

  constructor(private sharedDataService: SharedDataService, private router: Router, private formBuilder: FormBuilder, private http: HttpClient) {
    this.emp_ID = this.sharedDataService.getEmployeeId();
    this.isNewData = sharedDataService.get_isNewData();
    this.org_ID = sharedDataService.get_itemID();

    // If the program is in edit mode, this happens
    if (this.isNewData === false) {
      this.getOrganizationsItem().then(() => {
        this.editForm = this.formBuilder.group({
          mode: 'edit',
          org_name: [this.organizationsItem?.org_name, Validators.required],
          date: [this.organizationsItem?.date, Validators.required],
        });
      })
    }
    else {
      this.editForm = this.formBuilder.group({
        mode: 'add',
        org_name: [this.organizationsItem?.org_name, Validators.required],
        date: [this.organizationsItem?.date, Validators.required],
      });
    }
  }

  confirm() {
    const editData = {
      'tbl': 'tbl_org',
      'table_primary_key': 'org_ID',
      'emp_ID': this.emp_ID,
      'item_ID': this.org_ID,
      'mode': this.editForm.get('mode')!.value,
      'org_name': this.editForm.get('org_name')!.value,
      'date': this.editForm.get('date')!.value,
    };

    this.http.put<any>(`http://localhost:3000/updateItem`, editData)
      .subscribe(
        (resultData) => {
          this.router.navigate(['home/organization'])
        },
        error => {
          console.error("Something went wrong:", error);
        }
      )
  }
  cancel() { this.router.navigate(['home/organization']) }

  getOrganizationsItem() {
    const postData = {
      'item_ID': this.org_ID,
      'table_primary_key': 'org_ID',
      'page': 'organizations',
    };

    // Get Org Info
    return new Promise<void>((resolve, reject) => {
      this.http.post<Organizations>(`http://localhost:3000/readItem`, postData)
        .subscribe(
          (resultData: Organizations) => {
            // Set front end data taken from back end
            this.organizationsItem = resultData;
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
