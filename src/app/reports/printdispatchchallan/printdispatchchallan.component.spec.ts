import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintdispatchchallanComponent } from './printdispatchchallan.component';

describe('PrintdispatchchallanComponent', () => {
  let component: PrintdispatchchallanComponent;
  let fixture: ComponentFixture<PrintdispatchchallanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintdispatchchallanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintdispatchchallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
