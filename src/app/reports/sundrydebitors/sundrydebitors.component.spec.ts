import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SundrydebitorsComponent } from './sundrydebitors.component';

describe('SundrydebitorsComponent', () => {
  let component: SundrydebitorsComponent;
  let fixture: ComponentFixture<SundrydebitorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SundrydebitorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SundrydebitorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
