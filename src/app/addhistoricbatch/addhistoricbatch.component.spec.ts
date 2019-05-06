import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddhistoricbatchComponent } from './addhistoricbatch.component';

describe('AddhistoricbatchComponent', () => {
  let component: AddhistoricbatchComponent;
  let fixture: ComponentFixture<AddhistoricbatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddhistoricbatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddhistoricbatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
