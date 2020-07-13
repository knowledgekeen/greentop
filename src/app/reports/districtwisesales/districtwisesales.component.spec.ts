import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictwisesalesComponent } from './districtwisesales.component';

describe('DistrictwisesalesComponent', () => {
  let component: DistrictwisesalesComponent;
  let fixture: ComponentFixture<DistrictwisesalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistrictwisesalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistrictwisesalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
