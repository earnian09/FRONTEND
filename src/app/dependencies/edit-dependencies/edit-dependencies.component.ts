import { Component } from '@angular/core';
import { SharedDataService } from '../../shared-data-service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Dependencies } from '../../interfaces';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-dependencies',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './edit-dependencies.component.html',
  styleUrl: './edit-dependencies.component.css'
})
export class EditDependenciesComponent {
  emp_ID: number | null = null;
  dependenciesItem: Dependencies | null = null;
  isNewData: Boolean | null = null
  dependencies_ID: number | null = null; // Gets primary key
  editForm!: FormGroup;

  constructor(private sharedDataService: SharedDataService, private router: Router, private formBuilder: FormBuilder, private http: HttpClient) {
    this.emp_ID = this.sharedDataService.getEmployeeId();
    this.isNewData = sharedDataService.get_isNewData();
    this.dependencies_ID = sharedDataService.get_itemID();

    this.getDependenciesItem().then(() => {
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
        f_name: [this.dependenciesItem?.f_name, Validators.required],
        date_of_birth: [this.dependenciesItem?.date_of_birth, Validators.required],
        relationship: [this.dependenciesItem?.relationship, Validators.required]
      });
    }
    else {
      this.editForm = this.formBuilder.group({
        mode: 'add',
        f_name: [this.dependenciesItem?.f_name, Validators.required],
        date_of_birth: [this.dependenciesItem?.date_of_birth, Validators.required],
        relationship: [this.dependenciesItem?.relationship, Validators.required]
      });
    }
  }

  confirm() {
    const editData = {
      'tbl': 'tbl_dependencies',
      'table_primary_key': 'dependencies_ID',
      'emp_ID': this.emp_ID,
      'item_ID': this.dependencies_ID,
      'mode': this.editForm.get('mode')!.value,
      'f_name': this.editForm.get('f_name')!.value,
      'date_of_birth': this.editForm.get('date_of_birth')!.value,
      'relationship': this.editForm.get('relationship')!.value,
    };

    this.http.put<any>(`http://localhost:3000/updateItem`, editData)
      .subscribe(
        (resultData) => {
          this.router.navigate(['home/dependencies'])
        },
        error => {
          console.error("Something went wrong:", error);
        }
      )
  }
  cancel() { this.router.navigate(['home/dependencies']) }

  getDependenciesItem() {

    const postData = {
      'item_ID': this.dependencies_ID,
      'table_primary_key': 'dependencies_ID',
      'page': 'dependencies',
    };

    // Get Employee Info
    return new Promise<void>((resolve, reject) => {
      this.http.post<Dependencies>(`http://localhost:3000/readItem`, postData)
        .subscribe(
          (resultData: Dependencies) => {
            // Set front end data taken from back end
            this.dependenciesItem = resultData;
            resolve();
          },
          error => {
            console.error("Error fetching dependencies item:", error);
            alert("Sum Ting Wong");
            reject(error);
          }
        );
    });
  }

}
