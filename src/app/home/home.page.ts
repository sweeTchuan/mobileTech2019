import { Component, OnInit  } from '@angular/core';
import { Router} from '@angular/router';
// import { GlobalSettingsService } from '../Services/global-settings.service';
// import { PhotoService } from '../services/photo.service';
// import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
// import { FileChooser } from '@ionic-native/file-chooser/ngx';
// import { File } from '@ionic-native/File/ngx';
// import { FilePath } from '@ionic-native/file-path/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage  implements OnInit {
  // currentImage: any;
  uploadText: any;
  // fileTransfer: FileTransferObject;

  constructor(
    private router: Router,
    // public photoService: PhotoService,
    // private filePath: FilePath,
    // private global : GlobalSettingsService,
    // private transfer: FileTransfer,
    // private file : File,
    // private fileChooser: FileChooser
    ) {this.uploadText = "";}

  ngOnInit() {
    // this.photoService.loadSaved();
  }

  async navTabs(){
    //you can use either of below
    this.router.navigateByUrl('/tabs/(home:home)');
    //this.navCtrl.navigateRoot('/app/tabs/(home:home)')
  }

  // uploadFile(){
  //   //this.fileChooser.open().then(uri => console.log(uri)).catch(e => console.log(e));

  //   this.fileChooser.open().then((uri) => {
  //     this.filePath.resolveNativePath(uri).then(
  //       (native) => {
  //         this.fileTransfer = this.transfer.create();
  //         let options: FileUploadOptions = {
  //           fileKey: 'image',
  //           fileName: 'photo.jpg',
  //           chunkedMode: false,
  //           headers:{},
  //           mimeType: 'image/jpeg'
  //         }
  //         this.uploadText = 'Uploading...';
  //         console.log('native => ', native);
  //         this.fileTransfer.upload(native, this.global.fn_ApiURL('image'), options).then((data) => {
  //           console.log('data transfered =>', data);
  //           alert('transfer done = ' + JSON.stringify(data));
  //           this.uploadText = '';
  //         }, (err) => {
  //           alert(JSON.stringify(err));
  //           this.uploadText = '';
  //         });
  //       }, (err) => {
  //         alert(JSON.stringify(err));
  //       });

  //   }, (err) => {
  //     alert(JSON.stringify(err));
  //   });
  // }

}
