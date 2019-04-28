import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddpaymodeComponent } from './addpaymode.component';

describe('AddpaymodeComponent', () => {
  let component: AddpaymodeComponent;
  let fixture: ComponentFixture<AddpaymodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddpaymodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddpaymodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
