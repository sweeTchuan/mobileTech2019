import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tp2Page } from './tp2.page';

describe('Tp2Page', () => {
  let component: Tp2Page;
  let fixture: ComponentFixture<Tp2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tp2Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tp2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
