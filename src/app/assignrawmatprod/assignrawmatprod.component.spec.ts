import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignrawmatprodComponent } from './assignrawmatprod.component';

describe('AssignrawmatprodComponent', () => {
  let component: AssignrawmatprodComponent;
  let fixture: ComponentFixture<AssignrawmatprodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignrawmatprodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignrawmatprodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
