import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddreceiptComponent } from './addreceipt.component';

describe('AddreceiptComponent', () => {
  let component: AddreceiptComponent;
  let fixture: ComponentFixture<AddreceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddreceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddreceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
