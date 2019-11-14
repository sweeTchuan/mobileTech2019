import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TpLoginPage } from './tp-login.page';

describe('TpLoginPage', () => {
  let component: TpLoginPage;
  let fixture: ComponentFixture<TpLoginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TpLoginPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TpLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
