import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TpUploadProfilePicPage } from './tp-upload-profile-pic.page';

const routes: Routes = [
  {
    path: '',
    component: TpUploadProfilePicPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TpUploadProfilePicPage]
})
export class TpUploadProfilePicPageModule {}
