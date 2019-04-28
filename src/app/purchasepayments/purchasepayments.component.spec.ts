import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasepaymentsComponent } from './purchasepayments.component';

describe('PurchasepaymentsComponent', () => {
  let component: PurchasepaymentsComponent;
  let fixture: ComponentFixture<PurchasepaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchasepaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasepaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
