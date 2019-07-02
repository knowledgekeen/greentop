import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnauthoriseduserComponent } from './unauthoriseduser.component';

describe('UnauthoriseduserComponent', () => {
  let component: UnauthoriseduserComponent;
  let fixture: ComponentFixture<UnauthoriseduserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnauthoriseduserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnauthoriseduserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
