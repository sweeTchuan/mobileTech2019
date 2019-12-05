import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TpOnePostPage } from './tp-one-post.page';

describe('TpOnePostPage', () => {
  let component: TpOnePostPage;
  let fixture: ComponentFixture<TpOnePostPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TpOnePostPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TpOnePostPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
