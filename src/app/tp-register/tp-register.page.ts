import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { GlobalSettingsService } from '../Services/global-settings.service';
import { LoadingController, AlertController } from '@ionic/angular';
// import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-tp-register',
  templateUrl: './tp-register.page.html',
  styleUrls: ['./tp-register.page.scss'],
})
export class TpRegisterPage implements OnInit {
  txtEmail = '';
  txtUsername = '';
  txtName = '';
  txtPassword = '';
  txtConfirm = '';

  txtValidateEmail = '';
  txtValidateUsername = '';
  txtValidateName = '';
  txtValidatePassword = '';
  txtValidateConfirm = '';

  // regex pattern for email
  // source : http://regexlib.com/Search.aspx?k=email&c=1&m=3&ps=20
  pattern = '^([0-9a-zA-Z]([-.\\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\\w]*[0-9a-zA-Z]\\.)+[a-zA-Z]{2,9})$';
  // pattern = '[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})';

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private global: GlobalSettingsService,
    private loading: LoadingController,
    // private formBuilder: FormBuilder,
    private storage: Storage,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
    console.log('ngOnInit: RegisterPage');
  }

  ionViewWillEnter() {
    console.log('ionviewwillenter: RegisterPage');
  }

  // Sign Up button
  // prepareRegister()->register()->toAddProfile()
  prepareRegister() {
    console.log('=> register function');

    this.presentLoading();
    this.register()
      .pipe(
        finalize(async () => {
          await this.loading.dismiss();
        })
      ).subscribe(data => {
        console.log('request data => ', data);

        // Results from received from laravel api
        if (data['status'] === 1) {
          this.toAddProfilePic();
        } else {
          this.presentSignUpAlertPrompt('Sign Up failed.\nPlease Try Again');
        }

      }, error => {
        console.log(error);
        this.presentSignUpAlertPrompt('Connection to server failed!\nPlease Try again later.');
      });

  }

  // set required signup input for POST method to laravel api
  register(): Observable<object> {
    console.log('=> register ');
    const postData = {
      username: this.txtUsername,
      email: this.txtEmail,
      name: this.txtName,
      password: this.txtPassword,
      action: 'create_user'
    };

    // save current user details to local storage for next procedure.
    this.storage.set('currentSignUpUser', this.txtUsername);

    // http call to laravel api
    return this.httpClient.post(this.global.fn_ApiURL('user'), postData);
  }

  // Navigation to 'tp-upload-profile-pic' for add profile picture view.
  toAddProfilePic() {
    this.router.navigateByUrl('tp-upload-profile-pic', { replaceUrl: true });
  }

  // loading screen for signing up
  async presentLoading() {
    const loading = await this.loading.create({
      message: 'Signing Up',
      duration: 20000
    });
    await loading.present();

  }

  // alert prompt for sign up failed
  async presentSignUpAlertPrompt(msg) {
    const alert = await this.alertController.create({
      header: 'Sign Up',
      subHeader: 'Unsuccessful',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  // Simple validation to ensure input field is filled up and is in correct format
  validateUsername() {
    this.txtValidateUsername = (this.txtUsername === '') ? 'Username is required' : '';
  }

  validateEmail() {
    // pattern refer top ^
    if (this.txtEmail === '') {
      this.txtValidateEmail = 'Email is required';
    } else {
      this.txtValidateEmail = (this.txtEmail.match(this.pattern)) ? '' : 'Please enter a valid email address';
    }
  }

  validatePassword() {
    this.txtValidatePassword = (this.txtPassword === '') ? 'Password is required' : '';

    this.txtValidatePassword = (this.txtPassword.length < 5) ? 'Password min 5 characters' : '';
  }

  validateConfirm() {
    this.txtValidateConfirm = (this.txtConfirm !== this.txtPassword) ? 'Password does not match' : '';
  }

}
