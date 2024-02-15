import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { SharedDataService } from '../shared-data-service';
import { AllEmployees, EmployeeDetails, EmployeeInformation } from '../interfaces';
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
    emp_ID: number | null = null;

    employeeInformation: EmployeeInformation | null = null;
    employeeDetails: EmployeeDetails | null = null;

    currentEmployee: String | null = null;
    currentDepartment: String | null = null;

    allEmployees: AllEmployees[] = [];
    select_which_employee = 0;
    currentRoute$ = new BehaviorSubject<string>('');

    constructor(
        private router: Router,
        private sharedDataService: SharedDataService,
        private http: HttpClient
    ) {
        this.emp_ID = this.sharedDataService.getEmployeeId();
        // Sets if user is an employee, Dep Admin or HRMO Admin
        this.view_mode = sharedDataService.get_view_mode();        
        
        if (this.emp_ID == null) {
            console.log("emp_ID is null, running session service");
            this.emp_ID = Number(sharedDataService.getEmployeeId_session());
            sharedDataService.setEmployeeId(this.emp_ID)
        }
        if (this.view_mode == null) {
            console.log("view_mode is null, running session service");
            this.view_mode =  sharedDataService.get_view_mode_session();
            sharedDataService.set_view_mode(this.view_mode!)
        }

        if (this.view_mode == 'admin') {
            // Set which department the admin belongs to
            let department = sharedDataService.get_department();
            // Used for retrieving session storage
            if (this.currentDepartment == null) {
                this.currentDepartment = this.currentDepartment =  sharedDataService.get_department_session();
                department = this.currentDepartment;
            }
            // Get all employees if it's an admin
            this.getAllEmployees(department).then(() => {
            });
            this.getEmployeeInfo().then(() =>{
            });

            // Watches for select changes (select which employee to view)
            this.router.events.subscribe(event => {
                if (event instanceof NavigationEnd) {
                    const currentRoute = (event as NavigationEnd).urlAfterRedirects;
                    this.currentRoute$.next(currentRoute); // Update the current route
                }
            });
        }

        if (this.view_mode != 'admin') {
            // Get employee info (for the side bar)
            this.getEmployeeInfo().then(() => {
                this.currentEmployee = this.employeeInformation!.emp_name;
            });
            this.getDepartment().then(() => {
                this.currentDepartment = this.employeeDetails!.department;
            });
        }
    }

    getCurrentRoute(): BehaviorSubject<string> {
        return this.currentRoute$;
    }

    // Code to display employee info on the side bar
    getEmployeeInfo() {

        const postData = {
            'emp_ID': this.emp_ID,
            'page': 'employeeinfo',
        };

        // Get Employee Info
        return new Promise<void>((resolve, reject) => {
            this.http.post<EmployeeInformation>(`http://localhost:3000/read`, postData)
                .subscribe(
                    (resultData: EmployeeInformation) => {
                        // Set front end data taken from back end
                        this.employeeInformation = resultData;
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

    // Code to display employee department on the side bar
    getDepartment() {

        const postData = {
            'emp_ID': this.emp_ID,
            'page': 'employeedetails',
        };

        // Get Employee Detials
        return new Promise<void>((resolve, reject) => {
            this.http.post<EmployeeDetails>(`http://localhost:3000/read`, postData)
                .subscribe(
                    (resultData: EmployeeDetails) => {
                        // Set front end data taken from back end
                        this.employeeDetails = resultData;
                        resolve();
                    },
                    error => {
                        console.error("Error fetching employee details:", error);
                        alert("Sum Ting Wong");
                        reject(error);
                    }
                );
        });
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
        this.sharedDataService.setEmployeeId_session(this.select_which_employee.toString());

        // Subscribe to currentRoute$ to log after update
        this.currentRoute$.subscribe(currentRoute => {
        });
        this.router.navigate([this.currentRoute$.value])
    }

    logout() {
        // Clear previous session
        sessionStorage.clear();
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
