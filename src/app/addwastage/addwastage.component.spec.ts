import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddwastageComponent } from './addwastage.component';

describe('AddwastageComponent', () => {
  let component: AddwastageComponent;
  let fixture: ComponentFixture<AddwastageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddwastageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddwastageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
