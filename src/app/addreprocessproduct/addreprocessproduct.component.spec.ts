import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddreprocessproductComponent } from './addreprocessproduct.component';

describe('AddreprocessproductComponent', () => {
  let component: AddreprocessproductComponent;
  let fixture: ComponentFixture<AddreprocessproductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddreprocessproductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddreprocessproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
