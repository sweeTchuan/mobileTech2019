import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tp3Page } from './tp3.page';

describe('Tp3Page', () => {
  let component: Tp3Page;
  let fixture: ComponentFixture<Tp3Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tp3Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tp3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
