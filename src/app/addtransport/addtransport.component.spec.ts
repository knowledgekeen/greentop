import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddtransportComponent } from './addtransport.component';

describe('AddtransportComponent', () => {
  let component: AddtransportComponent;
  let fixture: ComponentFixture<AddtransportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddtransportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddtransportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
