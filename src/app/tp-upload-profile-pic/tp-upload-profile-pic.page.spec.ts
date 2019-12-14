import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TpUploadProfilePicPage } from './tp-upload-profile-pic.page';

describe('TpUploadProfilePicPage', () => {
  let component: TpUploadProfilePicPage;
  let fixture: ComponentFixture<TpUploadProfilePicPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TpUploadProfilePicPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TpUploadProfilePicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
