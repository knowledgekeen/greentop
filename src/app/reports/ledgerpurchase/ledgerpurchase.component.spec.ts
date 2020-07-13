import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerpurchaseComponent } from './ledgerpurchase.component';

describe('LedgerpurchaseComponent', () => {
  let component: LedgerpurchaseComponent;
  let fixture: ComponentFixture<LedgerpurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LedgerpurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgerpurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
