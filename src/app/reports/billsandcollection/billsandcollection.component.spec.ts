import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillsandcollectionComponent } from './billsandcollection.component';

describe('BillsandcollectionComponent', () => {
  let component: BillsandcollectionComponent;
  let fixture: ComponentFixture<BillsandcollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillsandcollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillsandcollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
