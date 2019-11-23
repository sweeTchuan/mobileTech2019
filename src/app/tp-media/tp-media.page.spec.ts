import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TpMediaPage } from './tp-media.page';

describe('TpMediaPage', () => {
  let component: TpMediaPage;
  let fixture: ComponentFixture<TpMediaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TpMediaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TpMediaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
