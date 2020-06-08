import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintsaleinvoiceComponent } from './printsaleinvoice.component';

describe('PrintsaleinvoiceComponent', () => {
  let component: PrintsaleinvoiceComponent;
  let fixture: ComponentFixture<PrintsaleinvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintsaleinvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintsaleinvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
