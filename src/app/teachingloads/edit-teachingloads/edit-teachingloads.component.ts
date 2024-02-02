import { Component } from '@angular/core';
import { TeachingLoads } from '../../interfaces';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedDataService } from '../../shared-data-service';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-teachingloads',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './edit-teachingloads.component.html',
  styleUrl: './edit-teachingloads.component.css'
})
export class EditTeachingloadsComponent {
  emp_ID: number | null = null;
  teachingloadsItem: TeachingLoads | null = null;
  isNewData: Boolean | null = null
  teachingloads_ID: number | null = null; // Gets primary key
  editForm!: FormGroup;

  constructor(private sharedDataService: SharedDataService, private router: Router, private formBuilder: FormBuilder, private http: HttpClient) {
    this.emp_ID = this.sharedDataService.getEmployeeId();
    this.isNewData = sharedDataService.get_isNewData();
    this.teachingloads_ID = sharedDataService.get_itemID();
    

    // If the program is in edit mode, this happens
    if (this.isNewData === false) {
      this.getTeachingLoadsItem().then(() => {
        this.editForm = this.formBuilder.group({
          mode: 'edit',
          acad_year: [this.teachingloadsItem?.acad_year, Validators.required],
          sem: [this.teachingloadsItem?.sem, Validators.required],
          sub_taught: [this.teachingloadsItem?.sub_taught, Validators.required],
          no_of_units: [this.teachingloadsItem?.no_of_units, Validators.required]
        });
      })
    }
    else {
      this.editForm = this.formBuilder.group({
        mode: 'add',
        acad_year: [this.teachingloadsItem?.acad_year, Validators.required],
        sem: [this.teachingloadsItem?.sem, Validators.required],
        sub_taught: [this.teachingloadsItem?.sub_taught, Validators.required],
        no_of_units: [this.teachingloadsItem?.no_of_units, Validators.required]
      });
    }
  }

  confirm() {
    const editData = {
      'tbl': 'tbl_teaching_loads',
      'table_primary_key': 'teachingloads_ID',
      'emp_ID': this.emp_ID,
      'item_ID': this.teachingloads_ID,
      'mode': this.editForm.get('mode')!.value,
      'acad_year': this.editForm.get('acad_year')!.value,
      'sem': this.editForm.get('sem')!.value,
      'sub_taught': this.editForm.get('sub_taught')!.value,
      'no_of_units': this.editForm.get('no_of_units')!.value,
    };
    console.log(editData);
    
    this.http.put<any>(`http://localhost:3000/updateItem`, editData)
      .subscribe(
        (resultData) => {
          this.router.navigate(['home/teachingloads'])
        },
        error => {
          console.error("Something went wrong:", error);
        }
      )}
  cancel() { this.router.navigate(['home/teachingloads']) }

  getTeachingLoadsItem() {

    const postData = {
      'item_ID': this.teachingloads_ID,
      'table_primary_key': 'teachingloads_ID',
      'page': 'teachingloads',
    };
    
    // Get Employee Info
    return new Promise<void>((resolve, reject) => {
      this.http.post<TeachingLoads>(`http://localhost:3000/readItem`, postData)
        .subscribe(
          (resultData: TeachingLoads) => {
            // Set front end data taken from back end
            this.teachingloadsItem = resultData;
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
