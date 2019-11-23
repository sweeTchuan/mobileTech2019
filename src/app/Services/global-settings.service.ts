import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalSettingsService {

  isLocal = false;

  apiIpLocal = '127.0.0.1:8000';
  apiPathLocal = '/api/';

  apiIp = '192.168.1.109';  // check ipconfig
  laravelProjectName = 'api-for-mobile-tech';
  apiPath = '/' + this.laravelProjectName + '/public/api/';

  constructor() { }

  ApiPath(apiName){
    let ip = this.isLocal ? this.apiIpLocal : this.apiIp;
    let path = this.isLocal ? this.apiPathLocal : this.apiPath;

    let url: string  = 'http://' + ip + path + apiName;
    console.log('API URL => ' + url);
    return url;
  }

}
