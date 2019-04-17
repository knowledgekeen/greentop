import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewpurchasesComponent } from './viewpurchases.component';

describe('ViewpurchasesComponent', () => {
  let component: ViewpurchasesComponent;
  let fixture: ComponentFixture<ViewpurchasesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewpurchasesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewpurchasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
