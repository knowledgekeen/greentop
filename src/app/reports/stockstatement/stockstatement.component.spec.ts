import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockstatementComponent } from './stockstatement.component';

describe('StockstatementComponent', () => {
  let component: StockstatementComponent;
  let fixture: ComponentFixture<StockstatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockstatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockstatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
