import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TpEditProfilePage } from './tp-edit-profile.page';

describe('TpEditProfilePage', () => {
  let component: TpEditProfilePage;
  let fixture: ComponentFixture<TpEditProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TpEditProfilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TpEditProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
