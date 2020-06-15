import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SundrycreditorsComponent } from './sundrycreditors.component';

describe('SundrycreditorsComponent', () => {
  let component: SundrycreditorsComponent;
  let fixture: ComponentFixture<SundrycreditorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SundrycreditorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SundrycreditorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
