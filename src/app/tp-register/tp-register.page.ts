import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { GlobalSettingsService } from '../Services/global-settings.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tp-register',
  templateUrl: './tp-register.page.html',
  styleUrls: ['./tp-register.page.scss'],
})
export class TpRegisterPage implements OnInit {
  email = '';
  username = '';
  password = '';

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private global: GlobalSettingsService,
    private loading: LoadingController) { }

  ngOnInit() {
  }

  register() {
    console.log('=> register function');

    const postData = {
      email: this.email,
      username: this.username,
      password : this.password,
      name : '',
      action : 'create_user'
    };
    this.presentLoadingWithOptions();


    this.httpClient.post(this.global.fn_ApiURL('user'), postData).subscribe(data => {
        console.log('request data => ' , data);
        this.toLogin();

       }, error => {
        console.log(error);
    });

  }

  toLogin() {

    this.router.navigateByUrl('tp-login');
  }

  async presentLoading() {
    const loading = await this.loading.create({
      message: 'Hellooo',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log('Loading dismissed!');
  }

  async presentLoadingWithOptions() {
    const loading = await this.loading.create({
      spinner: null,
      duration: 5000,
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present();
  }

  testingAPI(){
    // let ipAddress = '172.21.6.33';  // check ipconfig
    // let laravelProjectName = 'blog';
    // let apiName = 'user';
    // let apiPath = '/' + laravelProjectName + '/public/api/' + apiName; 
    // let url = 'http://' + ipAddress + apiPath;

    
  }

}
