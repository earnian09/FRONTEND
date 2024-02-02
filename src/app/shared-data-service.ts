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

  setEmployeeId(id: number): void {
    this.emp_ID = id;
  }

  getEmployeeId(): number | null {
    return this.emp_ID;
  }

  set_view_mode(mode: String): void {
    this.view_mode = mode;
  }

  get_view_mode(): String | null {
    return this.view_mode;
  }

  set_department(accessID: String): void {
    this.department = accessID;
  }

  get_department(): String | null {
    return this.department;
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
}
