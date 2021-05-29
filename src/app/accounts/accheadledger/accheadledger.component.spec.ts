import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccheadledgerComponent } from './accheadledger.component';

describe('AccheadledgerComponent', () => {
  let component: AccheadledgerComponent;
  let fixture: ComponentFixture<AccheadledgerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccheadledgerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccheadledgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
