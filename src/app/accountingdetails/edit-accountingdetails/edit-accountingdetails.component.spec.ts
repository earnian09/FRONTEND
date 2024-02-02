import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAccountingdetailsComponent } from './edit-accountingdetails.component';

describe('EditAccountingdetailsComponent', () => {
  let component: EditAccountingdetailsComponent;
  let fixture: ComponentFixture<EditAccountingdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAccountingdetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditAccountingdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
