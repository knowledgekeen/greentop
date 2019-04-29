import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorderComponent } from './editorder.component';

describe('EditorderComponent', () => {
  let component: EditorderComponent;
  let fixture: ComponentFixture<EditorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
