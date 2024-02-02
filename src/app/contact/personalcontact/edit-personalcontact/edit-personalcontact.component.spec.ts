import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPersonalcontactComponent } from './edit-personalcontact.component';

describe('EditPersonalcontactComponent', () => {
  let component: EditPersonalcontactComponent;
  let fixture: ComponentFixture<EditPersonalcontactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPersonalcontactComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditPersonalcontactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
