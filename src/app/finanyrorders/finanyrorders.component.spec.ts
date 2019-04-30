import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanyrordersComponent } from './finanyrorders.component';

describe('FinanyrordersComponent', () => {
  let component: FinanyrordersComponent;
  let fixture: ComponentFixture<FinanyrordersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinanyrordersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanyrordersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
