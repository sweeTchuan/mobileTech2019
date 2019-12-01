import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'posts',
        // outlet: 'tab2',
        loadChildren: '../tp-posts/tp-posts.module#TpPostsPageModule'
      },
      {
        path: 'addpost',
        // outlet: 'tab2',
        loadChildren: '../tp-add-post/tp-add-post.module#TpAddPostPageModule'
      },
      {
        path: 'profile',
        // outlet: 'tab2',
        loadChildren: '../tp-profile/tp-profile.module#TpProfilePageModule'
      },
      // { path: '', redirectTo: '/start/tabs/tab1', pathMatch: 'full'}
    ]
  },
  {
    path: '',
    redirectTo: '/start/tabs/posts',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}