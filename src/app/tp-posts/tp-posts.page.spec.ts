import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TpPostsPage } from './tp-posts.page';

describe('TpPostsPage', () => {
  let component: TpPostsPage;
  let fixture: ComponentFixture<TpPostsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TpPostsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TpPostsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
