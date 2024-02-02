import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingdetailsComponent } from './accountingdetails.component';

describe('AccountingdetailsComponent', () => {
  let component: AccountingdetailsComponent;
  let fixture: ComponentFixture<AccountingdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountingdetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountingdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
