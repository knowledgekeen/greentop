import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferopenbalComponent } from './transferopenbal.component';

describe('TransferopenbalComponent', () => {
  let component: TransferopenbalComponent;
  let fixture: ComponentFixture<TransferopenbalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferopenbalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferopenbalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
