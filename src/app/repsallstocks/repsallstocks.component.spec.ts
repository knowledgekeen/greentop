import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepsallstocksComponent } from './repsallstocks.component';

describe('RepsallstocksComponent', () => {
  let component: RepsallstocksComponent;
  let fixture: ComponentFixture<RepsallstocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepsallstocksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepsallstocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
