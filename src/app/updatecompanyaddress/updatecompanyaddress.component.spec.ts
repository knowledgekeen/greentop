import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatecompanyaddressComponent } from './updatecompanyaddress.component';

describe('UpdatecompanyaddressComponent', () => {
  let component: UpdatecompanyaddressComponent;
  let fixture: ComponentFixture<UpdatecompanyaddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatecompanyaddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatecompanyaddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
