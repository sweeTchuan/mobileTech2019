import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TpAboutUSPage } from './tp-about-us.page';

const routes: Routes = [
  {
    path: '',
    component: TpAboutUSPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TpAboutUSPage]
})
export class TpAboutUSPageModule {}
