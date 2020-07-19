import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountOpenbalComponent } from './account-openbal.component';

describe('AccountOpenbalComponent', () => {
  let component: AccountOpenbalComponent;
  let fixture: ComponentFixture<AccountOpenbalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountOpenbalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOpenbalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
