import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalcontactComponent } from './personalcontact.component';

describe('PersonalcontactComponent', () => {
  let component: PersonalcontactComponent;
  let fixture: ComponentFixture<PersonalcontactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalcontactComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonalcontactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
