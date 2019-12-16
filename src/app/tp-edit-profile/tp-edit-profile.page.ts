import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Platform, ActionSheetController, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { User } from '../Models/User';
import { isNullOrUndefined } from 'util';
import { GlobalSettingsService } from '../Services/global-settings.service';
import { HttpClient } from '@angular/common/http';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Image } from '../Models/Image';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

const STORAGE_KEY = 'my_profileImages';

@Component({
  selector: 'app-tp-edit-profile',
  templateUrl: './tp-edit-profile.page.html',
  styleUrls: ['./tp-edit-profile.page.scss'],
})
export class TpEditProfilePage implements OnInit {

  constructor(
    private plt: Platform,
    private router: Router,
    private ref: ChangeDetectorRef,
    private storage: Storage,
    private global: GlobalSettingsService,
    private http: HttpClient,
    private camera: Camera,
    private file: File,
    private webview: WebView,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private filePath: FilePath,
    private alertController: AlertController,

  ) { }

  objUser: User;
  txtName: string;
  txtUsername: string;
  txtEmail: string;
  txtSrcProfileImage = this.global.DefaultProfilePic;
  noChanges = true;               // check if any field is changed
  notAvailableUsername = true;    // work in progress for checking duplicate username in system
  notAvailableEmail = true;       // work in progress for checking duplicate email in system
  imageChanged = false;           // check whether new image is selected
  profileSectionChanged = false;  // check whether text input field has different input than original
  objTempImage: Image;

  // load current user details on init
  ngOnInit() {
    console.log('ngOnInit: editProfile');
    this.plt.ready().then(() => {
      this.storage.get('currentUser').then((val) => {
        if (!isNullOrUndefined(val)) {
          console.log('storage: profile user => ', val);
          this.objUser = val;
          this.loadUserDetails();
          this.objTempImage = new Image();
        }
      });
    });
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter: editProfile');
  }

  ionViewDidEnter() {
    console.log('ionViewWillEnter: editProfile');
    this.loadUserDetails();
  }

  // load user details from local storage
  loadUserDetails() {
    this.txtUsername = isNullOrUndefined(this.objUser.username) ? '' : this.objUser.username;
    if (!isNullOrUndefined(this.objUser.profilePicUrl) && this.objUser.profilePicUrl !== '') {
      this.txtSrcProfileImage = this.global.fn_imageURL(this.objUser.profilePicUrl);
      console.log('loadUserDetails: picURL=> ', this.txtSrcProfileImage);
    }
    this.txtName = isNullOrUndefined(this.objUser.name) ? '' : this.objUser.name;
    this.txtEmail = isNullOrUndefined(this.objUser.email) ? '' : this.objUser.email;
    this.ref.detectChanges();
  }

  // update current user in local storage
  updateUserDetails() {
    this.objUser.username = this.txtUsername;
    this.objUser.email = this.txtEmail;
    this.objUser.name = this.txtName;
    this.objUser.profilePicUrl = this.objTempImage.path;
    this.objUser.isUpdate = true;
    this.storage.set('currentUser', this.objUser);
    console.log('setLoginUser obj => ', this.objUser);
  }


  // =====================================================
  // the following functions is modified based on tutorial
  // - get image from camera and local file directory
  // - creating, saving and extracting the image file path
  // source:
  // https://devdactic.com/ionic-4-image-upload-storage/
  // =====================================================


  // button to start update process
  updateProfileStart() {
    console.log('=> updateProfile', this.objUser.id);
    console.log('txtName =>', this.txtName);
    console.log('txtUsername =>', this.txtUsername);
    console.log('txtEmail =>', this.txtEmail);
    this.profileSectionChanged = this.checkProfileSectionChanges();

    if (this.imageChanged === true) {
      this.updateProfilePic();
    } else {
      const formData = new FormData();
      formData.append('id', this.objUser.id.toString());
      formData.append('username', this.txtUsername);
      formData.append('email', this.txtEmail);
      formData.append('name', this.txtName);
      formData.append('action', 'update_user');
      this.updateProfileSection(formData);
    }

  }

  // check if any of the profile text field is changed or not
  checkProfileSectionChanges() {
    if (this.objUser.username !== this.txtUsername) {
      console.log(this.objUser.username, ' != ', this.txtUsername);
      this.noChanges = false;
      return true;
    }
    if (this.objUser.name !== this.txtName) {
      console.log(this.objUser.name, ' != ', this.txtName);
      this.noChanges = false;
      return true;
    }
    if (this.objUser.email !== this.txtEmail) {
      console.log(this.objUser.email, ' != ', this.txtEmail);
      this.noChanges = false;
      return true;
    }
    this.noChanges = true;
    return false;
  }

  // 1. http to api, only update text input of profile
  async updateProfileSection(formData: FormData) {
    const loading = await this.loadingController.create({
      message: 'Updating Profile...',
    });

    await loading.present();

    this.http.post(this.global.fn_ApiURL('user'), formData)
      .pipe(
        finalize(() => {
          loading.dismiss();
        })
      )
      .subscribe(res => {
        console.log('upload profile with image=> ', res);
        if (res['status']) {
          this.completeUpdateAction();

        } else {
          this.presentToast('Profile with photo update failed.');
        }
      });

  }


  // Functions that deals with Images
  pathForImage(img) {
    console.log('=> pathForImage');
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

  // button function to select image
  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image source',
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

  // function that handles the selection of image from camera or local file
  takePicture(sourceType: PictureSourceType) {
    console.log('=> takePicture');
    let options: CameraOptions = {
      quality: 20,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    this.camera.getPicture(options).then(imagePath => {
      if (this.plt.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            console.log('=> takePicture Android');
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          }, error => {
            console.log('err', error);
            this.invalidFileAlertPrompt('Invalid image file. Please choose again.');
          });
      } else {
        console.log('=> takePicture OTHER');
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    });

  }
  createFileName() {
    console.log('=> createFileName');
    let d = new Date(),
      n = d.getTime(),
      newFileName = n + '.jpg';
    return newFileName;
  }

  copyFileToLocalDir(namePath, currentName, newFileName) {
    console.log('=> copyFileToLocalDir');
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.updateStoredImages(newFileName);
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  // save the selected image in temperory storage.
  // then update the view of profile pic
  updateStoredImages(name) {
    console.log('=> updateStoredImages');
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
      console.log('resPath => ', resPath);
      console.log('filePath => ', filePath);

      this.objTempImage.name = name;
      this.objTempImage.path = resPath;
      this.objTempImage.filePath = filePath;
      this.updatePicView();

    });
  }

  // prompt for selecting file that is not valid image format
  async invalidFileAlertPrompt(msg) {
    const alert = await this.alertController.create({
      header: 'Insert Photo',
      subHeader: 'Unsuccessful',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  // update the page view after image isselected
  updatePicView() {
    this.txtSrcProfileImage = this.objTempImage.path;
    this.noChanges = false;
    this.imageChanged = true;
    this.ref.detectChanges(); // trigger change detection cycle
  }

  // button to start update profile process
  updateProfilePic() {
    console.log('=> updateProfilePic');
    this.startUpload();

  }

  startUpload() {
    console.log('=> startUpload ...');

    this.file.resolveLocalFilesystemUrl(this.objTempImage.filePath)
      .then(entry => {
        // ( < FileEntry > entry).file(file => this.readFile(file))
        (entry as FileEntry).file(file => this.readFile(file));
        console.log('File Entry =>', entry);
      })
      .catch(err => {
        this.presentToast('Error while reading file.');

      });
  }

  // read image file and prepare Post method input
  readFile(file: any) {
    console.log('=> readFile');
    console.log('File =>', file);
    const reader = new FileReader();
    reader.onloadend = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], {
        type: file.type
      });
      formData.append('image_profile', imgBlob, file.name);

      // choose to update profile picture only or with other text field.
      if (this.profileSectionChanged) {
        formData.append('id', this.objUser.id.toString());
        formData.append('username', this.txtUsername);
        formData.append('email', this.txtEmail);
        formData.append('name', this.txtName);
        formData.append('action', 'update_user_profile_all');
      } else {
        formData.append('username', this.objUser.username);
        formData.append('action', 'update_user_profile_pic');
      }

      this.uploadImageData(formData);
    };
    reader.readAsArrayBuffer(file);
  }

  // 2. http to api, update image only or all field
  async uploadImageData(formData: FormData) {
    const loading = await this.loadingController.create({
      message: 'Updating Profile...',
    });

    await loading.present();
    console.log('check complete');

    this.http.post(this.global.fn_ApiURL('user'), formData)
      .pipe(
        finalize(() => {
          loading.dismiss();
        })
      )
      .subscribe(res => {
        console.log('upload profile with image=> ', res);
        if (res['status']) {
          this.completeUpdateAction();
        } else {
          this.presentToast('Profile with photo update failed.')
        }
      });

  }

  completeUpdateAction() {
    this.presentToast('Profile with photo update complete.');
    this.updateUserDetails();
    this.router.navigateByUrl('/start/tabs/profile');
  }

}
