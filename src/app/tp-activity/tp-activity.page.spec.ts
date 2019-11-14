import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TpActivityPage } from './tp-activity.page';

describe('TpActivityPage', () => {
  let component: TpActivityPage;
  let fixture: ComponentFixture<TpActivityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TpActivityPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TpActivityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
