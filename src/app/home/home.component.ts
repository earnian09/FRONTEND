import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { SharedDataService } from '../shared-data-service';
import { AllEmployees } from '../interfaces';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, share } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, HttpClientModule, CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  view_mode: String | null = null;
  allEmployees: AllEmployees[] = [];
  select_which_employee = 0;
  currentRoute$ = new BehaviorSubject<string>('');

  constructor(
    private router: Router,
    private sharedDataService: SharedDataService,
    private http: HttpClient
  ) {
    // Sets if user is an employee, Dep Admin or HRMO Admin
    this.view_mode = sharedDataService.get_view_mode();

    if (this.view_mode == 'admin'){
      // Set which department the admin belongs to
      const department = sharedDataService.get_department();

      // Get all employees if it's an admin
      this.getAllEmployees(department).then(() => {
      });

      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          const currentRoute = (event as NavigationEnd).urlAfterRedirects;
          this.currentRoute$.next(currentRoute); // Update the current route
        }
      });
    }

  }
  
  getCurrentRoute(): BehaviorSubject<string> {
    return this.currentRoute$;
  }

  // Relevant Code for Admins
  getAllEmployees(department: String | null) {
    return new Promise<void>((resolve, reject) => {
      this.http.get<AllEmployees[]>(`http://localhost:3000/getAllEmployees/${department}`)
        .subscribe(
          (resultData: AllEmployees[]) => {
            // Set front end data taken from back end
            this.allEmployees = resultData;
            resolve();
          },
          error => {
            console.error("Error fetching employee info:", error);
            alert("Sum Ting Wong");
            reject(error);
          }
        );
    });
  }

  // This is also for Admins, does code whenever they selected a specific employee
  employee_selected_changed() {
    this.sharedDataService.setEmployeeId(this.select_which_employee);

    // Subscribe to currentRoute$ to log after update
    this.currentRoute$.subscribe(currentRoute => {
      console.log("Current Route (after update):", this.currentRoute$.value);
    });
    
    this.router.navigate([this.currentRoute$.value])
  }

  logout() {
    this.router.navigate(['/login'])
  }

  navigate(path: any) {
    this.router.navigate(['home', `${path}`])
  }

  // Code to disable pressed button
  buttonStates: boolean[] = [true, false];
  toggleDisabled(index: number) {
    // Disable current button
    this.buttonStates[index] = !this.buttonStates[index];
    // Reenable others
    for (let i = 0; i < this.buttonStates.length; i++) {
      if (i !== index) {
        this.buttonStates[i] = false;
      }
    }
  }
}
