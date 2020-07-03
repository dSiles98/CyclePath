import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BikesProvider } from '../../providers/bikes/bikes';
import {Bike} from '../../models/bike';
import { Camera , CameraOptions} from '@ionic-native/camera';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { storage, initializeApp } from 'firebase';
import { firebaseConfig } from '../../models/firebase.config';


@IonicPage()
@Component({
  selector: 'page-add-new-bike',
  templateUrl: 'add-new-bike.html',
})
export class AddNewBikePage {
  title: string;
  validator: FormGroup;
  image: SafeUrl;
  imageToSave: string;
  public firebaseRef: string;
  /**
   * Constructor
   * @param navCtrl 
   * @param formBuilder 
   * @param navParams 
   * @param bikeProvider 
   */
  constructor(public navCtrl: NavController, public formBuilder: FormBuilder, public navParams: NavParams,
    public bikeProvider: BikesProvider, public camera: Camera, public sanitizer: DomSanitizer) {
    this.title = this.navParams.get('title');
    this.getBike();
    this.validator = this.formBuilder.group({
      description: ['', Validators.required],
      price: ['', Validators.required]
    });
    this.firebaseRef = 'Bikes/';
    try {
      initializeApp(firebaseConfig);
    } 
    catch (error) {
    }
  }
  
  getBike() {
    if(this.title.toLowerCase() != 'addnewbike') {
      this.bikeProvider.getBike(this.navParams.get('rentPointId'), this.navParams.get('bikeId')).subscribe((response: Bike) => {
        this.validator.setValue({description: response.description, price: response.price});
        this.imageToSave = response.image;
      }, (error) => {
        console.log(error);
      });
    }
  }
  /**
   * this method add a new bike or edit a existend bike 
   */
  async addNewBike() {
    let fireBike;
    let fireBikeUUID;
    let newBike: Bike;
    newBike = new Bike();
    newBike.price = this.validator.get('price').value;
    newBike.description = this.validator.get('description').value;
    newBike.rentPointId = this.navParams.get('rentPointId');
    newBike.image = this.imageToSave;
    fireBikeUUID = this.generateUUID();
    if (this.image) {
      fireBike = await this.postImageToFirebase(newBike.image, newBike.rentPointId, fireBikeUUID);
      newBike.image = fireBike;
    }
    if(this.title.toLowerCase() === 'addnewbike') {
      this.bikeProvider.postBike(newBike).subscribe(() => {
        this.navCtrl.pop();
      });
    } else {
      newBike.id = this.navParams.get('bikeId');
      this.bikeProvider.editBike(newBike).subscribe(() => {
        this.navCtrl.pop();
      });
    }
  }

  getPicture()
  {
    let options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000,
      quality: 100
    }
    this.camera.getPicture(options)
      .then(imageData => {
        this.image = this.sanitizer.bypassSecurityTrustUrl(`data:image/jpeg;base64,${imageData}`);
        this.imageToSave = `data:image/jpeg;base64,${imageData}`;
      })
      .catch(error => {
        console.error(error);
      });
  }

  async postImageToFirebase(image: string, rentPointId: number, uuid: string)
  {
    let data: any;
    let destiny = storage().ref(`${this.firebaseRef}`);
    let imageRef = destiny.child(`${rentPointId}/${uuid}.jpg`);
      await imageRef.putString(image, 'data_url').then((download) => {
        data = download;
      });
      await data.ref.getDownloadURL().then((data) => {
        this.imageToSave = data;
      });
    return this.imageToSave;
  }

  private generateUUID(): string{
    function s4(){
      return Math.floor((1 + Math.random()) * 0x1000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
}
