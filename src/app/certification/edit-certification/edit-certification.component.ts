import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedDataService } from '../../shared-data-service';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Certification } from '../../interfaces';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, catchError, of, switchMap, tap } from 'rxjs';

interface UploadResponse {
  downloadLink: string;
  fileID: string;
}

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

  file: File | null = null;

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
        date_issued: [this.certificationItem?.date_issued, Validators.required],
        cert_time: [this.certificationItem?.cert_time, Validators.required],
        cert_title: [this.certificationItem?.cert_title, Validators.required],
        cert_validity: [this.certificationItem?.cert_validity, Validators.required],
        cert_type: [this.certificationItem?.cert_type, Validators.required],
        role: [this.certificationItem?.role, Validators.required],
        status: [this.certificationItem?.status, Validators.required],

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

  // For File Uploading
  onFileSelected(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.file = fileList[0];
    }

    // Checks if filetype is not pdf
    if (this.file?.type !== 'application/pdf') {
      // Handle invalid file type here
      alert('Invalid file type. Only PDF files are allowed.');
      // Clears input field
      event.target.value = null;
      return;
    }
  }

  // Define a boolean flag to track loading state
  loading = false;

  confirm() {
    this.loading = true; // Set loading to true when operation starts

    const editData = {
      'tbl': 'tbl_certification',
      'table_primary_key': 'cert_ID',
      'emp_ID': this.emp_ID,
      'item_ID': this.cert_ID,
      'mode': this.editForm.get('mode')!.value,
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
      .pipe(
        switchMap((resultData) => {
          let newUpload_cert_ID = resultData.cert_ID;

          // Upload Certification
          if (this.file) {
            const formData = new FormData();
            let fileName = this.file.name;
            formData.append('file', this.file, fileName);

            // Logic when attachment link exists
            if (this.certificationItem?.attachment !== null && this.certificationItem?.attachment !== undefined && this.certificationItem?.attachment !== '') {
              const postData_certificateDelete = {
                'attachment_ID': this.certificationItem!['attachment_id']
              };
              // If it exists, delete the file from gdrive, then upload the new one
              // Step 1: Delete from gdrive
              return this.http.post(`http://localhost:3000/deleteCertification`, postData_certificateDelete)
                .pipe(
                  switchMap(() => {
                    // Step 2: Upload new file
                    return this.http.post<UploadResponse>('http://localhost:3000/upload', formData)
                      .pipe(
                        switchMap(response => {
                          let downloadLink = response.downloadLink;
                          let fileID = response.fileID;

                          const attachmentData = {
                            'tbl': 'tbl_certification',
                            'table_primary_key': 'cert_ID',
                            'item_ID': this.cert_ID,
                            'mode': 'edit',
                            'attachment': downloadLink,
                            'attachment_name': fileName,
                            'attachment_id': fileID
                          };
                          // After it's done uploading, call the updateItem to update the attachment details
                          return this.http.put<any>(`http://localhost:3000/updateItem`, attachmentData);
                        }),
                        tap(() => {
                          // Set loading to false when operation completes
                          this.loading = false;
                        })
                      );
                  }),
                  catchError(error => {
                    console.error("Error deleting certification from drive", error);
                    alert("Something went wrong");
                    return EMPTY; // Returning an empty observable in case of error
                  })
                );
            } else {
              // Code executes if there is no file existing. Used for new item
              return this.http.post<UploadResponse>('http://localhost:3000/upload', formData)
                .pipe(
                  switchMap(response => {
                    let downloadLink = response.downloadLink;
                    let fileID = response.fileID;

                    const attachmentData = {
                      'tbl': 'tbl_certification',
                      'table_primary_key': 'cert_ID',
                      'item_ID': newUpload_cert_ID,
                      'mode': 'edit',
                      'attachment': downloadLink,
                      'attachment_name': fileName,
                      'attachment_id': fileID
                    };

                    return this.http.put<any>(`http://localhost:3000/updateItem`, attachmentData);
                  }),
                  tap(() => {
                    // Set loading to false when operation completes
                    this.loading = false;
                  })
                );
            }
          } else {
            // If no file to upload, return a dummy observable to proceed
            return of(null).pipe(
              tap(() => {
                // Set loading to false when operation completes
                this.loading = false;
              })
            );
          }
        })
      )
      .subscribe(
        () => {
          // After completion of all requests
          this.router.navigate(['home/certification']);
        },
        error => {
          console.error("Something went wrong:", error);
        }
      );


  }
  cancel() { this.router.navigate(['home/certification']) }

  // Clears after file upload
  clearFileInput(): void {
    this.file = null;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

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
