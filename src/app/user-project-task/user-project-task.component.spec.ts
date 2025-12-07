import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProjectTaskComponent } from './user-project-task.component';

describe('UserProjectTaskComponent', () => {
  let component: UserProjectTaskComponent;
  let fixture: ComponentFixture<UserProjectTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProjectTaskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProjectTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
