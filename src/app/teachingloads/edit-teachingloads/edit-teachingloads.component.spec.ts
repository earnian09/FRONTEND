import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTeachingloadsComponent } from './edit-teachingloads.component';

describe('EditTeachingloadsComponent', () => {
  let component: EditTeachingloadsComponent;
  let fixture: ComponentFixture<EditTeachingloadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTeachingloadsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditTeachingloadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
