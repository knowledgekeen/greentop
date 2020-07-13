import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsNavbarComponent } from './accounts-navbar.component';

describe('AccountsNavbarComponent', () => {
  let component: AccountsNavbarComponent;
  let fixture: ComponentFixture<AccountsNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountsNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
