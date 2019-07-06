import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateaccountheadComponent } from './createaccounthead.component';

describe('CreateaccountheadComponent', () => {
  let component: CreateaccountheadComponent;
  let fixture: ComponentFixture<CreateaccountheadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateaccountheadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateaccountheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
