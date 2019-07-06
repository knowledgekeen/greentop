import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewexpenditureComponent } from './viewexpenditure.component';

describe('ViewexpenditureComponent', () => {
  let component: ViewexpenditureComponent;
  let fixture: ComponentFixture<ViewexpenditureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewexpenditureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewexpenditureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
