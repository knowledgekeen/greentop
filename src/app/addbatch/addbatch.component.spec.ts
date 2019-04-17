import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddbatchComponent } from './addbatch.component';

describe('AddbatchComponent', () => {
  let component: AddbatchComponent;
  let fixture: ComponentFixture<AddbatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddbatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddbatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
