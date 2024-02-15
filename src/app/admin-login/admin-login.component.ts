import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { SharedDataService } from '../shared-data-service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, NgIf],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
  loginForm!: FormGroup;
  constructor(private router: Router, private http: HttpClient, private formBuilder: FormBuilder, private sharedDataService: SharedDataService) { }
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['1', Validators.required],
      password: ['1', Validators.required],
      accessid: ['SOC', Validators.required]
    });
  }

  submit() {
    // Set credential controls to check
    const usernameControl = this.loginForm.get('username');
    const passwordControl = this.loginForm.get('password');
    const accessidControl = this.loginForm.get('accessid');

    const postData = {
      'emp_ID': usernameControl?.value,
      'password': passwordControl?.value,
    };

    // Checks if something is missing
    if (usernameControl?.errors?.['required'] ||
    passwordControl?.errors?.['required'] ||
    accessidControl?.errors?.['required']) {
      alert("Missing credentials!");
      // Checks if the form is valid
    } else if (this.loginForm.valid) {
      this.http.post(`http://localhost:3000/login`, postData)
        .subscribe(
          (resultData) => {
            // Saves employee ID to be used in other components
            this.sharedDataService.setEmployeeId(usernameControl?.value);
            this.sharedDataService.setEmployeeId_session(usernameControl?.value);

            // Save view mode (this tells the system which view to do), relevant for employee vs admin login
            this.sharedDataService.set_view_mode('admin')
            this.sharedDataService.set_view_mode_session('admin')

            this.sharedDataService.set_department(accessidControl?.value)
            this.sharedDataService.set_department_session(accessidControl?.value);
            this.router.navigate(['/home'])
          },
          error => {
            alert("Invalid Username or Password")
          }
        );
    }
  }
}
