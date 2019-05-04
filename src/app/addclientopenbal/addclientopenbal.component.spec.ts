import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddclientopenbalComponent } from './addclientopenbal.component';

describe('AddclientopenbalComponent', () => {
  let component: AddclientopenbalComponent;
  let fixture: ComponentFixture<AddclientopenbalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddclientopenbalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddclientopenbalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
