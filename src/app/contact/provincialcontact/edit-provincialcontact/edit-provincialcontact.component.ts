import { Component } from '@angular/core';
import { ProvincialContact } from '../../../interfaces';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedDataService } from '../../../shared-data-service';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-provincialcontact',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './edit-provincialcontact.component.html',
  styleUrl: './edit-provincialcontact.component.css'
})
export class EditProvincialcontactComponent {
  emp_ID: number | null = null;
  provincialItem: ProvincialContact | null = null;
  isNewData: Boolean | null = null
  provincial_ID: number | null = null; // Gets primary key
  editForm!: FormGroup;

  constructor(private sharedDataService: SharedDataService, private router: Router, private formBuilder: FormBuilder, private http: HttpClient) {
    this.emp_ID = this.sharedDataService.getEmployeeId();
    this.isNewData = sharedDataService.get_isNewData();
    this.provincial_ID = sharedDataService.get_itemID();

    // If the program is in edit mode, this happens

    this.getProvincialContactItem().then(() => {
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
        provincial_add: [this.provincialItem?.provincial_add, Validators.required],
        provincial_phone: [this.provincialItem?.provincial_phone, Validators.required],
      });

    }
    else {
      this.editForm = this.formBuilder.group({
        mode: 'add',
        provincial_add: [this.provincialItem?.provincial_add, Validators.required],
        provincial_phone: [this.provincialItem?.provincial_phone, Validators.required],
      });
    }
  }

  confirm() {
    const editData = {
      'tbl': 'tbl_provincial_contact',
      'table_primary_key': 'provincial_ID',
      'emp_ID': this.emp_ID,
      'item_ID': this.provincial_ID,
      'mode': this.editForm.get('mode')!.value,
      'provincial_add': this.editForm.get('provincial_add')!.value,
      'provincial_phone': this.editForm.get('provincial_phone')!.value,
    };

    this.http.put<any>(`http://localhost:3000/updateItem`, editData)
      .subscribe(
        (resultData) => {
          this.router.navigate(['home/provincialcontact'])
        },
        error => {
          console.error("Something went wrong:", error);
        }
      )
  }
  cancel() { this.router.navigate(['home/provincialcontact']) }

  getProvincialContactItem() {

    const postData = {
      'item_ID': this.provincial_ID,
      'table_primary_key': 'provincial_ID',
      'page': 'provincialcontact',
    };

    // Get ProvincialItem
    return new Promise<void>((resolve, reject) => {
      this.http.post<ProvincialContact>(`http://localhost:3000/readItem`, postData)
        .subscribe(
          (resultData: ProvincialContact) => {
            // Set front end data taken from back end
            this.provincialItem = resultData;
            resolve();
          },
          error => {
            console.error("Error fetching provincial Item:", error);
            alert("Sum Ting Wong");
            reject(error);
          }
        );
    });
  }
}
