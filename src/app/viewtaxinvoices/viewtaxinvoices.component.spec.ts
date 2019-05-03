import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewtaxinvoicesComponent } from './viewtaxinvoices.component';

describe('ViewtaxinvoicesComponent', () => {
  let component: ViewtaxinvoicesComponent;
  let fixture: ComponentFixture<ViewtaxinvoicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewtaxinvoicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewtaxinvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
