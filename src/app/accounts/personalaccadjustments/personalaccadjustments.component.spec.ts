import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalaccadjustmentsComponent } from './personalaccadjustments.component';

describe('PersonalaccadjustmentsComponent', () => {
  let component: PersonalaccadjustmentsComponent;
  let fixture: ComponentFixture<PersonalaccadjustmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalaccadjustmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalaccadjustmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
