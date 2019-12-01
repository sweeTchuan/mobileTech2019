import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { GlobalSettingsService } from '../Services/global-settings.service';
import { AlertController, Platform, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { User } from '../Models/User';

@Component({
  selector: 'app-tp-login',
  templateUrl: './tp-login.page.html',
  styleUrls: ['./tp-login.page.scss'],
})
export class TpLoginPage implements OnInit {

  username = '';
  password = '';
  isCheckingApi = true;

  constructor(
    private plt: Platform,
    private httpClient: HttpClient,
    private router: Router,
    private global: GlobalSettingsService,
    private alertController: AlertController,
    private storage: Storage,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.plt.ready().then(() => {
      this.checkApiStatus();
      this.checkUserIsLogin();
    });

  }

  login() {
    console.log('=> login function');

    this.presentLoading();
    this.prepareLogin()
      .pipe(
        finalize(async () => {
          await this.loadingController.dismiss();
        })
      ).subscribe(data => {
        console.log('Request data => ', data);

        if (data['status'] === 1) {
          this.setLoginUser(data['data'][0]);
          this.toPosts();
        } else {
          this.presentSignInAlertPrompt('Incorect username or password.\nPlease Try Again');
        }
      }, error => {
        console.log('err', error);
        this.presentSignInAlertPrompt('Connection to server failed!\nPlease Try again later.');
      });

  }

  prepareLogin(): Observable<object> {
    const postData = {
      username: this.username,
      password: this.password,
      action: 'login_user'
    };
    return this.httpClient.post(this.global.fn_ApiURL('user'), postData);
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Signing In',
      // duration: 2000
    });
    await loading.present();

  }

  toPosts() {
    this.router.navigateByUrl('start');
  }

  setLoginUser(data) {
    // console.log('login data',data);
    let objUser = new User();
    objUser.id = data.id,
      objUser.username = data.username;
    objUser.email = data.email;
    objUser.isLogin = true;
    this.storage.set('currentUser', objUser);
    console.log('setLoginUser obj => ', objUser);
    // this.storage.get('currentUser').then((val) => {
    //   console.log('currentUser =>', val);
    // });
  }

  async presentSignInAlertPrompt(msg) {
    const alert = await this.alertController.create({
      header: 'Signing In',
      subHeader: 'Unsuccessful',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  checkUserIsLogin(){
    this.storage.get('currentUser').then((val) => {
      let user: User = val;
      if(user.isLogin == true){
        this.toPosts();
      }

    });
  }



  // for changing IP address and Laravel Project name

  changeIP() {
    console.log('change Server settings');
    this.presentAlertPrompt();
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: 'Dev Server Settings',
      inputs: [
        {
          name: 'ipAddress',
          type: 'text',
          placeholder: 'IP Address',
          value: this.global.apiIp
        },
        {
          name: 'LaravelProjectName',
          type: 'text',
          placeholder: 'Laravel Project Name',
          value: this.global.laravelProject
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: data => {

            this.storage.set('serverIP', data.ipAddress);
            this.storage.set('laravelProject', data.LaravelProjectName);
            this.global.fn_changeApiIP(data.ipAddress);
            this.global.fn_changeLaravelProject(data.LaravelProjectName);
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }

  checkApiStatus() {

    this.httpClient.post(this.global.fn_ApiURL('testingp'), {}).subscribe(data => {
      console.log('check Api Status => ', data);
      if (data['status'] == 1) {
        setTimeout(() => {
          this.isCheckingApi = false;
        }, 3000);
      }
    }, error => {
      console.log(error);
    });
  }

}
