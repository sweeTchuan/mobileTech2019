import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TpRegisterPage } from './tp-register.page';

describe('TpRegisterPage', () => {
  let component: TpRegisterPage;
  let fixture: ComponentFixture<TpRegisterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TpRegisterPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TpRegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
