import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasepayhistoryComponent } from './purchasepayhistory.component';

describe('PurchasepayhistoryComponent', () => {
  let component: PurchasepayhistoryComponent;
  let fixture: ComponentFixture<PurchasepayhistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchasepayhistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasepayhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
