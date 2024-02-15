import { Component } from '@angular/core';
import { SharedDataService } from '../../shared-data-service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Certification } from '../../interfaces';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-certification',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './edit-certification.component.html',
  styleUrl: './edit-certification.component.css'
})
export class EditCertificationComponent {
  emp_ID: number | null = null;
  certificationItem: Certification | null = null;
  isNewData: Boolean | null = null
  cert_ID: number | null = null; // Gets primary key
  editForm!: FormGroup;

  constructor(private sharedDataService: SharedDataService, private router: Router, private formBuilder: FormBuilder, private http: HttpClient) {
    this.emp_ID = this.sharedDataService.getEmployeeId();
    this.isNewData = sharedDataService.get_isNewData();
    this.cert_ID = sharedDataService.get_itemID();

    // If the program is in edit mode, this happens
    
    this.getCertificationItem().then(() => {
      this.initForm();
    });
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
          attachment: [this.certificationItem?.attachment, Validators.required],
          date_issued: [this.certificationItem?.date_issued, Validators.required],
          cert_time: [this.certificationItem?.cert_time, Validators.required],
          cert_title: [this.certificationItem?.cert_title, Validators.required],
          cert_validity: [this.certificationItem?.cert_validity, Validators.required],
          cert_type: [this.certificationItem?.cert_type, Validators.required],
          role: [this.certificationItem?.role, Validators.required],
          status: ['Approved'],

      })
    }
    else {
      this.editForm = this.formBuilder.group({
        mode: 'add',
        attachment: [this.certificationItem?.attachment, Validators.required],
        date_issued: [this.certificationItem?.date_issued, Validators.required],
        cert_time: [this.certificationItem?.cert_time, Validators.required],
        cert_title: [this.certificationItem?.cert_title, Validators.required],
        cert_validity: [this.certificationItem?.cert_validity, Validators.required],
        cert_type: [this.certificationItem?.cert_type, Validators.required],
        role: [this.certificationItem?.role, Validators.required],
        status: ['Pending'],
      });
    }
  }

  confirm() {
    const editData = {
      'tbl': 'tbl_certification',
      'table_primary_key': 'cert_ID',
      'emp_ID': this.emp_ID,
      'item_ID': this.cert_ID,
      'mode': this.editForm.get('mode')!.value,
      'attachment': this.editForm.get('attachment')!.value,
      'date_issued': this.editForm.get('date_issued')!.value,
      'cert_time': this.editForm.get('cert_time')!.value,
      'cert_title': this.editForm.get('cert_title')!.value,
      'cert_validity': this.editForm.get('cert_validity')!.value,
      'cert_type': this.editForm.get('cert_type')!.value,
      'role': this.editForm.get('role')!.value,
      'status': this.editForm.get('status')!.value,
    };

    // Handles date being null, replaces with empty string to avoid errors
    editData.date_issued ??= '';
    editData.cert_time ??= '';

    this.http.put<any>(`http://localhost:3000/updateItem`, editData)
      .subscribe(
        (resultData) => {
          this.router.navigate(['home/certification'])
        },
        error => {
          console.error("Something went wrong:", error);
        }
      )
  }
  cancel() { this.router.navigate(['home/dependencies']) }

  getCertificationItem() {

    const postData = {
      'item_ID': this.cert_ID,
      'table_primary_key': 'cert_ID',
      'page': 'certification',
    };

    // Get Certification Item
    return new Promise<void>((resolve, reject) => {
      this.http.post<Certification>(`http://localhost:3000/readItem`, postData)
        .subscribe(
          (resultData: Certification) => {
            // Set front end data taken from back end
            this.certificationItem = resultData;
            resolve();
          },
          error => {
            console.error("Error fetching certification Item:", error);
            alert("Sum Ting Wong");
            reject(error);
          }
        );
    });
  }

}
