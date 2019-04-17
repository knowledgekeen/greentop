import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewtransportComponent } from './viewtransport.component';

describe('ViewtransportComponent', () => {
  let component: ViewtransportComponent;
  let fixture: ComponentFixture<ViewtransportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewtransportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewtransportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
