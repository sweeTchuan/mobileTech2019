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

  pattern = '[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})';




  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private global: GlobalSettingsService,
    private loading: LoadingController,
    // private formBuilder: FormBuilder,
    private storage: Storage,
    private alertController: AlertController,
  ) { }

  // get username() {
  //   return this.registrationForm.get("username");
  // }
  // get email() {
  //   return this.registrationForm.get("email");
  // }
  // get name() {
  //   return this.registrationForm.get("name");
  // }
  // get password(){
  //   return this.registrationForm.get("password");

  // }
  // get confirm(){
  //   return this.registrationForm.get("confirm");

  // }

  // registrationForm = this.formBuilder.group({
  //   username: ['', [Validators.required, Validators.maxLength(100)]],
  //   email: ['',
  //   [
  //     Validators.required,
  //     Validators.pattern('^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$')
  //   ]],
  //   password: ['',[Validators.required, Validators.maxLength(20)]],
  //   name: ['', [ Validators.maxLength(100)]],
  //   // confirm: ['', [Validators.required]]
  // });

  public errorMessages = {
    username: [
      { type: 'required', message: 'Username is required' },
      { type: 'maxlength', message: 'Username cant be longer than 100 characters' }
    ],
    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Please enter a valid email address' }
    ],
    name: [
      // { type: 'required', message: 'Phone number is required' },
      { type: 'maxlength', message: 'Username cant be longer than 100 characters' }
      // { type: 'pattern', message: 'Please enter a valid phone number' }
    ],
    password: [
      { type: 'required', message: 'Password is required' },
      // {
      //   type: 'maxlength',
      //   message: 'Street name cant be longer than 100 characters'
      // }
    ],
    // confirm: [
    //   { type: 'required', message: 'Password is required' },
    //   // {
    //   //   type: 'maxlength',
    //   //   message: 'Street name cant be longer than 100 characters'
    //   // }
    // ],

  };



  ngOnInit() {
    console.log('ngOnInit: RegisterPage');
  }

  ionViewWillEnter() {
    console.log('ionviewwillenter: RegisterPage');
  }

  submit() {
    // console.log('submit =>',this.registrationForm.value);
    // let postForm = this.registrationForm.value;

    // // postForm.action = 'create_user';
    // console.log('submit: action added => ',postForm);
    // const postData = {
    //   username: postForm.username,
    //   email: postForm.email,
    //   name : postForm.name,
    //   password : postForm.password,
    //   action : 'create_user'
    // };
    // this.register(postData);


  }
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
        // this.toLogin();

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


  register(): Observable<object> {
    console.log('=> register ');
    const postData = {
      username: this.txtUsername,
      email: this.txtEmail,
      name: this.txtName,
      password: this.txtPassword,
      action: 'create_user'
    };

    this.storage.set('currentSignUpUser', this.txtUsername);

    return this.httpClient.post(this.global.fn_ApiURL('user'), postData);
  }

  toAddProfilePic() {
    this.router.navigateByUrl('tp-upload-profile-pic', { replaceUrl: true });
  }

  toLogin() {

    this.router.navigateByUrl('tp-login');
  }

  async presentLoading() {
    const loading = await this.loading.create({
      message: 'Signing Up',
      duration: 20000
    });
    await loading.present();

    // const { role, data } = await loading.onDidDismiss();

    // console.log('Loading dismissed!');
  }

  async presentSignUpAlertPrompt(msg) {
    const alert = await this.alertController.create({
      header: 'Sign Up',
      subHeader: 'Unsuccessful',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  // async presentLoadingWithOptions() {
  //   const loading = await this.loading.create({
  //     spinner: null,
  //     duration: 5000,
  //     message: 'Please wait...',
  //     translucent: true,
  //     cssClass: 'custom-class custom-loading'
  //   });
  //   return await loading.present();
  // }

 
  validateUsername() {
    this.txtValidateUsername = (this.txtUsername === '') ? 'Username is required' : '';
  }

  validateEmail() {
    // pattern('^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$')
    
    // this.txtEmail.match(pattern);
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
    this.txtValidateConfirm = (this.txtConfirm != this.txtPassword) ? 'Password does not match' : '';
  }

}
