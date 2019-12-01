import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { ActionSheetController, ToastController, Platform, LoadingController } from '@ionic/angular';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { HttpClient } from '@angular/common/http';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';
import { FilePath } from '@ionic-native/file-path/ngx';
import { finalize } from 'rxjs/operators';
import { ConcatSource } from 'webpack-sources';
import { GlobalSettingsService } from '../Services/global-settings.service';

const STORAGE_KEY = 'my_images';

@Component({
  selector: 'app-tp-add-post',
  templateUrl: './tp-add-post.page.html',
  styleUrls: ['./tp-add-post.page.scss'],
})
export class TpAddPostPage implements OnInit {
  // postImage;
  // imgSrc;
  // isHidden = false;
  txtImageButton = 'Insert a image';
  images =[];
  objTempImage ;
  // imgTempPost;

  constructor(
    private camera: Camera,
    private file: File,
    private http: HttpClient,
    private webview: WebView,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private storage: Storage,
    private plt: Platform,
    private loadingController: LoadingController,
    private ref: ChangeDetectorRef,
    private filePath: FilePath,
    private global: GlobalSettingsService
  ) { }

  ngOnInit() {
    // this.isHidden = false;
    // this.postImage = '/assets/testc1.jpg';   
    // this.postImage = 'http://localhost/_app_file_/data/user/0/io.ionic.starter/files/1575013415863.jpg';
    this.objTempImage = new PostImage() ;
    
  }

  pathForImage(img) {
    console.log('steps: pathForImage');
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }
 
  async presentToast(text) {
    const toast = await this.toastController.create({
        message: text,
        position: 'bottom',
        duration: 3000
    });
    toast.present();
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
        header: "Select Image source",
        buttons: [{
                text: 'Load from Library',
                handler: () => {
                    this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
                }
            },
            {
                text: 'Use Camera',
                handler: () => {
                    this.takePicture(this.camera.PictureSourceType.CAMERA);
                }
            },
            {
                text: 'Cancel',
                role: 'cancel'
            }
        ]
    });
    await actionSheet.present();
  }
  
  takePicture(sourceType: PictureSourceType) {
      var options: CameraOptions = {
          quality: 20,
          sourceType: sourceType,
          saveToPhotoAlbum: false,
          correctOrientation: true
      };
  
      this.camera.getPicture(options).then(imagePath => {
          if (this.plt.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
              this.filePath.resolveNativePath(imagePath)
                  .then(filePath => {
                    console.log('steps: takePicture Android');
                    let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                    let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                    this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
                  });
          } else {
            console.log('steps: takePicture OTHER');
            var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
            var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          }
      });
  
  }
  createFileName() {
    console.log('steps: createFileName');
    var d = new Date(),
        n = d.getTime(),
        newFileName = n + ".jpg";
    return newFileName;
  }
  
  copyFileToLocalDir(namePath, currentName, newFileName) {
    console.log('steps: copyFileToLocalDir');
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
        this.updateStoredImages(newFileName);
    }, error => {
        this.presentToast('Error while storing file.');
    });
  }
  
  updateStoredImages(name) {
    console.log('steps: updateStoredImages');
    this.storage.get(STORAGE_KEY).then(images => {
        let arr = JSON.parse(images);
        if (!arr) {
            let newImages = [name];
            this.storage.set(STORAGE_KEY, JSON.stringify(newImages));
        } else {
            arr.push(name);
            this.storage.set(STORAGE_KEY, JSON.stringify(arr));
        }

        let filePath = this.file.dataDirectory + name;
        let resPath = this.pathForImage(filePath);
        console.log('resPath=> ', resPath);
        console.log('filePath=> ', filePath);

        let newEntry = {
            name: name,
            path: resPath,
            filePath: filePath
        };
        console.log("steps: updateStoredImages");
        // this.images = [newEntry, ...this.images];
        
        this.objTempImage = newEntry;
        this.ref.detectChanges(); // trigger change detection cycle
    });
  }
  deleteImage(imgEntry, position) {
    // this.images.splice(position, 1);
 
    this.storage.get(STORAGE_KEY).then(images => {
        let arr = JSON.parse(images);
        let filtered = arr.filter(name => name != imgEntry.name);
        this.storage.set(STORAGE_KEY, JSON.stringify(filtered));
 
        var correctPath = imgEntry.filePath.substr(0, imgEntry.filePath.lastIndexOf('/') + 1);
 
        this.file.removeFile(correctPath, imgEntry.name).then(res => {
            this.presentToast('File removed.');
        });
    });
  }
  // startUpload(imgEntry) {
  startUpload() {
      // console.log('start upload ...');
      // console.log('imgEntry =>',imgEntry);
      // console.log('imgEntry.filepath =>', imgEntry.filePath);


      // this.file.resolveLocalFilesystemUrl(imgEntry.filePath)
      this.file.resolveLocalFilesystemUrl(this.objTempImage.filePath)
        .then(entry => {
            // ( < FileEntry > entry).file(file => this.readFile(file))
            ( entry as FileEntry).file(file => this.readFile(file));
            console.log('entry =>', entry);
        })
        .catch(err => {
            this.presentToast('Error while reading file.');
        });
  }
  
  readFile(file: any) {
    console.log('steps: readFile');
    console.log('file =>', file);
    const reader = new FileReader();
    reader.onloadend = () => {
        const formData = new FormData();
        const imgBlob = new Blob([reader.result], {
            type: file.type
        });
        formData.append('image', imgBlob, file.name);
        formData.append('caption', 'from ionic');
        formData.append('user_id', '1');

        this.uploadImageData(formData);
    };
    reader.readAsArrayBuffer(file);
  }
 
  async uploadImageData(formData: FormData) {
      const loading = await this.loadingController.create({
          message: 'Uploading image...',
      });

      console.log('form data =>',formData);
      await loading.present();
  
    //   this.http.post("http://localhost:8888/upload.php", formData)
      this.http.post(this.global.fn_ApiURL('newpost'), formData)
          .pipe(
              finalize(() => {
                  loading.dismiss();
              })
          )
          .subscribe(res => {
              if (res['success']) {
                  this.presentToast('File upload complete.')
              } else {
                  this.presentToast('File upload failed.')
              }
          });
  }

}


class PostImage {
  name: string;
  path: string;
  filePath: string;
}