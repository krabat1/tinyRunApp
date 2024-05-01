import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskmanComponent } from './taskman.component';

describe('TaskmanComponent', () => {
  let component: TaskmanComponent;
  let fixture: ComponentFixture<TaskmanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskmanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskmanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
