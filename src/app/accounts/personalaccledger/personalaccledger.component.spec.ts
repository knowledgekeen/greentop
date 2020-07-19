import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalaccledgerComponent } from './personalaccledger.component';

describe('PersonalaccledgerComponent', () => {
  let component: PersonalaccledgerComponent;
  let fixture: ComponentFixture<PersonalaccledgerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalaccledgerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalaccledgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
