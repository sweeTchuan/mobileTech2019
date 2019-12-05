import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TpOnePostPage } from './tp-one-post.page';

const routes: Routes = [
  {
    path: '',
    component: TpOnePostPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TpOnePostPage]
})
export class TpOnePostPageModule {}
