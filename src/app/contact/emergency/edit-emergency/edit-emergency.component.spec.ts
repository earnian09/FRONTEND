import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmergencyComponent } from './edit-emergency.component';

describe('EditEmergencyComponent', () => {
  let component: EditEmergencyComponent;
  let fixture: ComponentFixture<EditEmergencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEmergencyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditEmergencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
