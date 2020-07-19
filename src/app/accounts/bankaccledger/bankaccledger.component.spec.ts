import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankaccledgerComponent } from './bankaccledger.component';

describe('BankaccledgerComponent', () => {
  let component: BankaccledgerComponent;
  let fixture: ComponentFixture<BankaccledgerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankaccledgerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankaccledgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
