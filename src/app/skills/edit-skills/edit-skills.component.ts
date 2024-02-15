import { Component } from '@angular/core';
import { SharedDataService } from '../../shared-data-service';
import { Skills } from '../../interfaces';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-skills',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './edit-skills.component.html',
  styleUrl: './edit-skills.component.css'
})
export class EditSkillsComponent {
  emp_ID: number | null = null;
  skillsItem: Skills | null = null;
  isNewData: Boolean | null = null
  skills_ID: number | null = null; // Gets primary key
  editForm!: FormGroup;

  constructor(private sharedDataService: SharedDataService, private router: Router, private formBuilder: FormBuilder, private http: HttpClient) {
    this.emp_ID = this.sharedDataService.getEmployeeId();
    this.isNewData = sharedDataService.get_isNewData();
    this.skills_ID = sharedDataService.get_itemID();

    // If the program is in edit mode, this happens
    
    this.getSkillsItem().then(() => {
      this.initForm();
    })
  }
  ngOnInit() {
    if (!this.editForm) {
      this.initForm();
    }
  }

  initForm(){
    if (this.isNewData === false) {
        this.editForm = this.formBuilder.group({
          mode: 'edit',
          skills: [this.skillsItem?.skills, Validators.required],
        });

    }
    else {
      this.editForm = this.formBuilder.group({
        mode: 'add',
        skills: [this.skillsItem?.skills, Validators.required],
      });
    }
  }

  confirm() {
    const editData = {
      'tbl': 'tbl_skills',
      'table_primary_key': 'skills_ID',
      'emp_ID': this.emp_ID,
      'item_ID': this.skills_ID,
      'mode': this.editForm.get('mode')!.value,
      'skills': this.editForm.get('skills')!.value,
    };

    this.http.put<any>(`http://localhost:3000/updateItem`, editData)
      .subscribe(
        (resultData) => {
          this.router.navigate(['home/skills'])
        },
        error => {
          console.error("Something went wrong:", error);
        }
      )
  }
  cancel() { this.router.navigate(['home/skills']) }

  getSkillsItem() {

    const postData = {
      'item_ID': this.skills_ID,
      'table_primary_key': 'skills_ID',
      'page': 'skills',
    };

    // Get Skills
    return new Promise<void>((resolve, reject) => {
      this.http.post<Skills>(`http://localhost:3000/readItem`, postData)
        .subscribe(
          (resultData: Skills) => {
            // Set front end data taken from back end
            this.skillsItem = resultData;
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
