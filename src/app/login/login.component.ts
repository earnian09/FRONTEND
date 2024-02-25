import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { SharedDataService } from '../shared-data-service';

interface LoginResponse {
  emp_ID: number;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private router: Router, private http: HttpClient, private formBuilder: FormBuilder, private sharedDataService: SharedDataService) { }
  ngOnInit(): void {

    this.loginForm = this.formBuilder.group({
      username: ['username1', Validators.required],
      password: ['1', Validators.required]
    });
  }

  submit() {
    // Set credential controls to check
    const usernameControl = this.loginForm.get('username');
    const passwordControl = this.loginForm.get('password');

    const postData = {
      'username': usernameControl?.value,
      'password': passwordControl?.value,
    };

    // Checks if something is missing
    if (usernameControl?.errors?.['required'] || passwordControl?.errors?.['required']) {
      alert("Missing credentials!");
      // Checks if the form is valid
    } else if (this.loginForm.valid) {
      this.http.post<LoginResponse>(`http://localhost:3000/login`, postData)
        .subscribe(
          (resultData) => {

            // Clear previous session
            sessionStorage.clear();
            
            const emp_ID = resultData.emp_ID;

            // Saves employee ID to be used in other components
            this.sharedDataService.setEmployeeId(emp_ID);
            this.sharedDataService.setEmployeeId_session(emp_ID.toString());

            // Save view mode (this tells the system which view to do), relevant for employee vs admin login
            this.sharedDataService.set_view_mode('employee')
            this.sharedDataService.set_view_mode_session('employee')

            // Saves currentPage in the session
            this.sharedDataService.set_currentPage_session('employeeinformation')

            this.router.navigate(['/home'])
          },
          error => {
            alert("Invalid Username or Password")
          }
        );
    }
  }
}
