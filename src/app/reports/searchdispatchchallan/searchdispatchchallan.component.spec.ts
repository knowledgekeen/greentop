import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchdispatchchallanComponent } from './searchdispatchchallan.component';

describe('SearchdispatchchallanComponent', () => {
  let component: SearchdispatchchallanComponent;
  let fixture: ComponentFixture<SearchdispatchchallanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchdispatchchallanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchdispatchchallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
