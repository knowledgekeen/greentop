import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthwisepurchasesComponent } from './monthwisepurchases.component';

describe('MonthwisepurchasesComponent', () => {
  let component: MonthwisepurchasesComponent;
  let fixture: ComponentFixture<MonthwisepurchasesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthwisepurchasesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthwisepurchasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
