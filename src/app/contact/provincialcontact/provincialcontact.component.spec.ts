import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvincialcontactComponent } from './provincialcontact.component';

describe('ProvincialcontactComponent', () => {
  let component: ProvincialcontactComponent;
  let fixture: ComponentFixture<ProvincialcontactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProvincialcontactComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProvincialcontactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
