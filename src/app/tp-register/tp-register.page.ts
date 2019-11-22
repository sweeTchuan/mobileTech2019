import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
    private httpClient: HttpClient) { }

  ngOnInit() {
  }

  register() {
    const postData = {
      email: this.email,
      username: this.username,
      password : this.password,
      name : '',
      action : 'create_user'
    };

    this.httpClient.post('http://127.0.0.1:8000/api/user', postData).subscribe(data => {
        console.log(data);
        this.router.navigateByUrl('tp-login');
       }, error => {
        console.log(error);
    });

  }

  toLogin() {
    
    this.router.navigateByUrl('tp-login');
  }

  testingAPI(){
    // this.httpClient.post('http://127.0.0.1:8000/api/testingp', postData).subscribe(data => {
    //     console.log(data);
    //     this.router.navigateByUrl('tp-login');
    //    }, error => {
    //     console.log(error);
    // });

    // this.httpClient.get('http://127.0.0.1:8000/api/testingg').subscribe(data => {
    //     console.log(data);
    //     this.router.navigateByUrl('tp-login');
    //    }, error => {
    //     console.log(error);
    // });
  }

}
