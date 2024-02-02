import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachingloadsComponent } from './teachingloads.component';

describe('TeachingloadsComponent', () => {
  let component: TeachingloadsComponent;
  let fixture: ComponentFixture<TeachingloadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeachingloadsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeachingloadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
