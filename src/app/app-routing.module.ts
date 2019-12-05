import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'tp-login', pathMatch: 'full' },
  // { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  // { path: 'test-page', loadChildren: './test-page/test-page.module#TestPagePageModule' },
  // { path: 'tp2', loadChildren: './tp2/tp2.module#Tp2PageModule' },
  // { path: 'tp-activity', loadChildren: './tp-activity/tp-activity.module#TpActivityPageModule' },
  { path: 'tp-profile', loadChildren: './tp-profile/tp-profile.module#TpProfilePageModule' },
  { path: 'tp-login', loadChildren: './tp-login/tp-login.module#TpLoginPageModule' },
  { path: 'tp-register', loadChildren: './tp-register/tp-register.module#TpRegisterPageModule' },
  { path: 'tp-add-post', loadChildren: './tp-add-post/tp-add-post.module#TpAddPostPageModule' },
  { path: 'tp-posts', loadChildren: './tp-posts/tp-posts.module#TpPostsPageModule' },
  // { path: 'tp-media', loadChildren: './tp-media/tp-media.module#TpMediaPageModule' },
  { path: 'start', loadChildren: './tabs/tabs.module#TabsPageModule' },
  // { path: 'tp-take-picture', loadChildren: './tp-take-picture/tp-take-picture.module#TpTakePicturePageModule' },
  { path: 'tp-edit-profile', loadChildren: './tp-edit-profile/tp-edit-profile.module#TpEditProfilePageModule' },
  { path: 'tp-one-post', loadChildren: './tp-one-post/tp-one-post.module#TpOnePostPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
