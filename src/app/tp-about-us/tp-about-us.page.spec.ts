import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TpAboutUSPage } from './tp-about-us.page';

describe('TpAboutUSPage', () => {
  let component: TpAboutUSPage;
  let fixture: ComponentFixture<TpAboutUSPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TpAboutUSPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TpAboutUSPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
