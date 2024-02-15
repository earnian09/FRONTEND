import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { SharedDataService } from '../shared-data-service';

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
      username: ['1', Validators.required],
      password: ['1', Validators.required]
    });
  }

  submit() {
    // Set credential controls to check
    const usernameControl = this.loginForm.get('username');
    const passwordControl = this.loginForm.get('password');

    const postData = {
      'emp_ID': usernameControl?.value,
      'password': passwordControl?.value,
    };

    // Checks if something is missing
    if (usernameControl?.errors?.['required'] || passwordControl?.errors?.['required']) {
      alert("Missing credentials!");
      // Checks if the form is valid
    } else if (this.loginForm.valid) {
      this.http.post(`http://localhost:3000/login`, postData)
        .subscribe(
          (resultData) => {

            // Clear previous session
            sessionStorage.clear();

            // Saves employee ID to be used in other components
            this.sharedDataService.setEmployeeId(usernameControl?.value);
            this.sharedDataService.setEmployeeId_session(usernameControl?.value);

            // Save view mode (this tells the system which view to do), relevant for employee vs admin login
            this.sharedDataService.set_view_mode('employee')
            this.sharedDataService.set_view_mode_session('employee')

            this.router.navigate(['/home'])
          },
          error => {
            alert("Invalid Username or Password")
          }
        );
    }
  }
}
