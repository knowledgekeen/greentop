import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddexpenditureComponent } from './addexpenditure.component';

describe('AddexpenditureComponent', () => {
  let component: AddexpenditureComponent;
  let fixture: ComponentFixture<AddexpenditureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddexpenditureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddexpenditureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
