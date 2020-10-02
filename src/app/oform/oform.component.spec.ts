import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OformComponent } from './oform.component';

describe('OformComponent', () => {
  let component: OformComponent;
  let fixture: ComponentFixture<OformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
