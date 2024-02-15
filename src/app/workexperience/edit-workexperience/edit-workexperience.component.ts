import { Component } from '@angular/core';
import { WorkExperience } from '../../interfaces';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedDataService } from '../../shared-data-service';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-workexperience',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './edit-workexperience.component.html',
  styleUrl: './edit-workexperience.component.css'
})
export class EditWorkexperienceComponent {
  emp_ID: number | null = null;
  experienceItem: WorkExperience | null = null;
  isNewData: Boolean | null = null
  experience_ID: number | null = null; // Gets primary key
  editForm!: FormGroup;

  constructor(private sharedDataService: SharedDataService, private router: Router, private formBuilder: FormBuilder, private http: HttpClient) {
    this.emp_ID = this.sharedDataService.getEmployeeId();
    this.isNewData = sharedDataService.get_isNewData();
    this.experience_ID = sharedDataService.get_itemID();

    // If the program is in edit mode, this happens
    this.getWorkExperienceItem().then(() => {
      this.initForm();
    })
  }
  
  ngOnInit() {
    if (!this.editForm) {
      this.initForm();
    }
  }

  initForm() {
    if (this.isNewData === false) {

      this.editForm = this.formBuilder.group({
        mode: 'edit',
        company_name: [this.experienceItem?.company_name, Validators.required],
        date: [this.experienceItem?.date, Validators.required],
        company_add: [this.experienceItem?.company_add, Validators.required],
        position: [this.experienceItem?.position, Validators.required],
        reason_exit: [this.experienceItem?.reason_exit, Validators.required],
        type: [this.experienceItem?.type, Validators.required],
      });
    }
    else {
      this.editForm = this.formBuilder.group({
        mode: 'add',
        company_name: [this.experienceItem?.company_name, Validators.required],
        date: [this.experienceItem?.date, Validators.required],
        company_add: [this.experienceItem?.company_add, Validators.required],
        position: [this.experienceItem?.position, Validators.required],
        reason_exit: [this.experienceItem?.reason_exit, Validators.required],
        type: [this.experienceItem?.type, Validators.required],
      });
    }
  }

  confirm() {
    const editData = {
      'tbl': 'tbl_experience',
      'table_primary_key': 'experience_ID',
      'emp_ID': this.emp_ID,
      'item_ID': this.experience_ID,
      'mode': this.editForm.get('mode')!.value,
      'company_name': this.editForm.get('company_name')!.value,
      'date': this.editForm.get('date')!.value,
      'company_add': this.editForm.get('company_add')!.value,
      'position': this.editForm.get('position')!.value,
      'reason_exit': this.editForm.get('reason_exit')!.value,
      'type': this.editForm.get('type')!.value,
    };

    // Handles date being null, replaces with empty string to avoid errors
    editData.date ??= '';

    this.http.put<any>(`http://localhost:3000/updateItem`, editData)
      .subscribe(
        (resultData) => {
          this.router.navigate(['home/workexperience'])
        },
        error => {
          console.error("Something went wrong:", error);
        }
      )
  }
  cancel() { this.router.navigate(['home/workexperience']) }

  getWorkExperienceItem() {

    const postData = {
      'item_ID': this.experience_ID,
      'table_primary_key': 'experience_ID',
      'page': 'workexperience',
    };

    // Get Experience Info
    return new Promise<void>((resolve, reject) => {
      this.http.post<WorkExperience>(`http://localhost:3000/readItem`, postData)
        .subscribe(
          (resultData: WorkExperience) => {
            // Set front end data taken from back end
            this.experienceItem = resultData;
            resolve();
          },
          error => {
            console.error("Error fetching Experience Item:", error);
            alert("Sum Ting Wong");
            reject(error);
          }
        );
    });
  }
}
