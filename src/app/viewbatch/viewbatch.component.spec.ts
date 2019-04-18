import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewbatchComponent } from './viewbatch.component';

describe('ViewbatchComponent', () => {
  let component: ViewbatchComponent;
  let fixture: ComponentFixture<ViewbatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewbatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewbatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
