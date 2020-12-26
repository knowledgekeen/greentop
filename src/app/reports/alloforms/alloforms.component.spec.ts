import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlloformsComponent } from './alloforms.component';

describe('AlloformsComponent', () => {
  let component: AlloformsComponent;
  let fixture: ComponentFixture<AlloformsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlloformsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlloformsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
