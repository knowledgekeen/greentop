import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchinvoiceComponent } from './searchinvoice.component';

describe('SearchinvoiceComponent', () => {
  let component: SearchinvoiceComponent;
  let fixture: ComponentFixture<SearchinvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchinvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchinvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
