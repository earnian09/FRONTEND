import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProvincialcontactComponent } from './edit-provincialcontact.component';

describe('EditProvincialcontactComponent', () => {
  let component: EditProvincialcontactComponent;
  let fixture: ComponentFixture<EditProvincialcontactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProvincialcontactComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditProvincialcontactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
