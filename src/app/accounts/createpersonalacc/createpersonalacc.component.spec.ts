import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatepersonalaccComponent } from './createpersonalacc.component';

describe('CreatepersonalaccComponent', () => {
  let component: CreatepersonalaccComponent;
  let fixture: ComponentFixture<CreatepersonalaccComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatepersonalaccComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatepersonalaccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
