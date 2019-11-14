import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';    
import { HTTP } from '@ionic-native/http/ngx';

@Component({
  selector: 'app-tp-register',
  templateUrl: './tp-register.page.html',
  styleUrls: ['./tp-register.page.scss'],
})
export class TpRegisterPage implements OnInit {
  email = '';

  constructor(private router: Router, private httpClient: HttpClient, private http: HTTP) { }

  ngOnInit() {
  }
  register() {
    // this.router.navigateByUrl('home');

    console.log(this.email);


    this.httpClient.get('http://127.0.0.1:8000/api/user').subscribe(data => {
      console.log('my data: ', data);
    });




  //   this.http.get('http://127.0.0.1:8000/api/user', {}, {})
  // .then(data => {

  //   console.log(data.status);
  //   console.log(data.data); // data received by server
  //   console.log(data.headers);

  // })
  // .catch(error => {

  //   console.log(error.status);
  //   console.log(error.error); // error message as string
  //   console.log(error.headers);

  // });

  }

}
