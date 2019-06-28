import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalespayhistoryComponent } from './salespayhistory.component';

describe('SalespayhistoryComponent', () => {
  let component: SalespayhistoryComponent;
  let fixture: ComponentFixture<SalespayhistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalespayhistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalespayhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
