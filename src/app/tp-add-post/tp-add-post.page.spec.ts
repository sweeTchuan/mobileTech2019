import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TpAddPostPage } from './tp-add-post.page';

describe('TpAddPostPage', () => {
  let component: TpAddPostPage;
  let fixture: ComponentFixture<TpAddPostPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TpAddPostPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TpAddPostPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
