import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaserawmaterialComponent } from './purchaserawmaterial.component';

describe('PurchaserawmaterialComponent', () => {
  let component: PurchaserawmaterialComponent;
  let fixture: ComponentFixture<PurchaserawmaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaserawmaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaserawmaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
