import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewtrucksComponent } from './viewtrucks.component';

describe('ViewtrucksComponent', () => {
  let component: ViewtrucksComponent;
  let fixture: ComponentFixture<ViewtrucksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewtrucksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewtrucksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
