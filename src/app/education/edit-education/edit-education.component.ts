import { Component } from '@angular/core';
import { Education } from '../../interfaces';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedDataService } from '../../shared-data-service';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-education',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './edit-education.component.html',
  styleUrl: './edit-education.component.css'
})
export class EditEducationComponent {
  emp_ID: number | null = null;
  degree: String | null = null;
  education: Education | null = null;
  editForm!: FormGroup;

  constructor(private sharedDataService: SharedDataService, private router: Router, private formBuilder: FormBuilder, private http: HttpClient) {
    this.emp_ID = this.sharedDataService.getEmployeeId();
    this.degree = sharedDataService.get_Degree();

    this.getEducation().then(() => {
      this.initForm();
    });
  }

  ngOnInit() {
    if (!this.editForm) {
      this.initForm();
    }
  }

  initForm() {
    this.editForm = this.formBuilder.group({
    bac_school: [this.education?.bac_school, Validators.required],
    bac_grad_date: [this.education?.bac_grad_date, Validators.required],
    mas_school: [this.education?.mas_school, Validators.required],
    mas_grad_date: [this.education?.mas_grad_date, Validators.required],
    doc_school: [this.education?.doc_school, Validators.required],
    doc_grad_date: [this.education?.doc_grad_date, Validators.required],
    prof_lic: [this.education?.prof_lic, Validators.required],
    lic_ID: [this.education?.lic_ID, Validators.required],
  });
  }

  confirm() {
    let editData = {
      'tbl': 'tbl_education',
      'emp_ID': this.emp_ID,
      'bac_school': this.editForm.get('bac_school')!.value,
      'bac_grad_date': this.editForm.get('bac_grad_date')!.value,
      'mas_school': this.editForm.get('mas_school')!.value,
      'mas_grad_date': this.editForm.get('mas_grad_date')!.value,
      'doc_school': this.editForm.get('doc_school')!.value,
      'doc_grad_date': this.editForm.get('doc_grad_date')!.value,
      'prof_lic': this.editForm.get('prof_lic')!.value,
      'lic_ID': this.editForm.get('lic_ID')!.value,
    };

    // Make sures all values return empty or 0 if they are null
    for (const key in editData) {
      if (editData.hasOwnProperty(key)) {
        // Assert the type of key
        const typedKey = key as keyof typeof editData;
        
        // Check if the value is null or undefined
        if (editData[typedKey] === null || editData[typedKey] === undefined) {
          // If the value is null or undefined, replace it with an empty string for string types
          // and with 0 for number types
          editData[typedKey] = typeof editData[typedKey] === 'number' ? 0 : '';
        }
      }
    }    

    this.http.put<any>(`http://localhost:3000/update`, editData)
      .subscribe(
        (resultData) => {
          this.router.navigate(['home/education'])
        },
        error => {
          console.error("Something went wrong:", error);
        }
      )
  }

  cancel() {
    this.router.navigate(['home/education'])
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
