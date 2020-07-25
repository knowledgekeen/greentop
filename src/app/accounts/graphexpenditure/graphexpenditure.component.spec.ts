import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphexpenditureComponent } from './graphexpenditure.component';

describe('GraphexpenditureComponent', () => {
  let component: GraphexpenditureComponent;
  let fixture: ComponentFixture<GraphexpenditureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphexpenditureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphexpenditureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
