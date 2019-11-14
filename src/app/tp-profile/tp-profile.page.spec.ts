import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TpProfilePage } from './tp-profile.page';

describe('TpProfilePage', () => {
  let component: TpProfilePage;
  let fixture: ComponentFixture<TpProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TpProfilePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TpProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
