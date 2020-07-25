import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashaccledgerComponent } from './cashaccledger.component';

describe('CashaccledgerComponent', () => {
  let component: CashaccledgerComponent;
  let fixture: ComponentFixture<CashaccledgerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashaccledgerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashaccledgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
