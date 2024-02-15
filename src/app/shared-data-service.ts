import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private emp_ID: number | null = null;
  private view_mode: String | null = null;
  private department: String | null = null;
  private newData: Boolean | null = null;
  private item_ID: number | null = null;
  private degree: String | null = null;

  // Saves employee ID to be used in other components
  setEmployeeId(id: number): void {
    this.emp_ID = id;
  }
  getEmployeeId(): number | null {
    return this.emp_ID;
  }

  // Saves employee ID in the session
  setEmployeeId_session(emp_ID: string) {    
    sessionStorage.setItem('emp_ID', emp_ID);
  }
  getEmployeeId_session(): string | null {
    return sessionStorage.getItem('emp_ID')
  }

  // Sets the view mode (tells the system which view to display) relevant for employee vs admin login
  set_view_mode(view_mode: String): void {
    this.view_mode = view_mode;
  }
  get_view_mode(): String | null {
    return this.view_mode;
  }

  // Saves view_mode in the session
  set_view_mode_session(department: string) {
    sessionStorage.setItem('department', department);
  }
  get_view_mode_session(): string | null {
    return sessionStorage.getItem('department')
  }

  // Used by dep admin to access all employees within the department (select in the sidebar)
  set_department(accessID: String): void {
    this.department = accessID;
  }
  get_department(): String | null {
    return this.department;
  }
  
  // Saves department in the session
  set_department_session(view_mode: string) {
    sessionStorage.setItem('view_mode', view_mode);
  }
  get_department_session(): string | null {
    return sessionStorage.getItem('view_mode')
  }

  // Used for Creating Data in the front end
  set_isNewData(newData: Boolean): void {
    this.newData = newData;
  }
  get_isNewData(): Boolean | null {
    return this.newData;
  }

  // Used for Passing item ID of loopable components. E.g. dependencies_ID
  set_itemID(item_ID: number): void {
    this.item_ID = item_ID;
  }
  get_itemID(): number | null {
    return this.item_ID;
  }

  // Used for determining which degree in the education.component. note: Licences are included
  set_Degree(degree: String): void {
    this.degree = degree;
  }

  get_Degree(): String | null {
    return this.degree;
  }
}
