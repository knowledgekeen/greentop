import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgersalesComponent } from './ledgersales.component';

describe('LedgersalesComponent', () => {
  let component: LedgersalesComponent;
  let fixture: ComponentFixture<LedgersalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LedgersalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgersalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
