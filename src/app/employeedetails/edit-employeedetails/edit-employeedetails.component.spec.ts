import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmployeedetailsComponent } from './edit-employeedetails.component';

describe('EditEmployeedetailsComponent', () => {
  let component: EditEmployeedetailsComponent;
  let fixture: ComponentFixture<EditEmployeedetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEmployeedetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditEmployeedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
