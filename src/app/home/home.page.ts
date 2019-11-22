import { Component } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private router: Router) {}

  async navTabs(){
    //you can use either of below
    this.router.navigateByUrl('/tabs/(home:home)');
    //this.navCtrl.navigateRoot('/app/tabs/(home:home)')
}

}
