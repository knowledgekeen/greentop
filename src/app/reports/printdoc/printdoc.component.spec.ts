import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintdocComponent } from './printdoc.component';

describe('PrintdocComponent', () => {
  let component: PrintdocComponent;
  let fixture: ComponentFixture<PrintdocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintdocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintdocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
