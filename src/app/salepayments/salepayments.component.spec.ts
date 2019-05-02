import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalepaymentsComponent } from './salepayments.component';

describe('SalepaymentsComponent', () => {
  let component: SalepaymentsComponent;
  let fixture: ComponentFixture<SalepaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalepaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalepaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
