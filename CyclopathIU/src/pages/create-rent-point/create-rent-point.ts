import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ImagePicker } from '@ionic-native/image-picker';
import { Geolocation } from '@ionic-native/geolocation';
import { IRentPoint, RentPoint } from '../../models/rent-point';
import { RentPointProvider } from '../../providers/rent-point/rent-point';
import { MyRentPointsPage } from '../my-rent-points/my-rent-points';
import { TranslateService } from '@ngx-translate/core';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';
import { ILocality } from '../../models/google-maps';
import { Subscription } from 'rxjs';

@IonicPage()
@Component({
  selector: 'page-create-rent-point',
  templateUrl: 'create-rent-point.html',
})
export class CreateRentPointPage {
  private validator: FormGroup;
  private actualMarker: google.maps.Marker;
  private location: ILocality;
  private mapClick: Subscription = null;
  private mapSubscription: Subscription = null;
  private mapSelected: google.maps.Map;
  private mapEventListener: google.maps.MapsEventListener;
  toast;

  /**
   * Constructor
   */
  constructor(public navCtrl: NavController, public rentProv: RentPointProvider,
    public navParams: NavParams, public form: FormBuilder, public imagePicker: ImagePicker,
    public geolocation: Geolocation, private toastCtrl: ToastController, public translate: TranslateService,
    protected androidPermissions: AndroidPermissions, private googleMapsProvider: GoogleMapsProvider) {
    this.validator = this.form.group({
      title: ['', Validators.compose([Validators.maxLength(50), Validators.pattern('[a-zA-Z0-9 ./]*'), Validators.required])],
      direction: ['', Validators.compose([Validators.maxLength(100), Validators.pattern('[a-zA-Z0-9 ./]*'), Validators.required])],
      rentpoint: ['', Validators.compose([Validators.required])]
    });
  }

  /**
  * This method get my position when the page is loaded
  */
  ionViewDidLoad() {
    this.mapSubscription = this.googleMapsProvider.mapSubject$.subscribe((map: google.maps.Map) => {
      this.googleMapsProvider.addMarker(map, this.googleMapsProvider.currentPosition, 'Your Position');
      this.mapSelected = map;
      this.mapEventListener = this.googleMapsProvider.addEventListenerToMap(this.mapSelected);
    });
    this.mapClick = this.googleMapsProvider.mapClick$.subscribe((response) => {
      if (this.actualMarker) {
        this.googleMapsProvider.removeMarker(this.actualMarker);
      }
      var marker = this.googleMapsProvider.addMarker(this.mapSelected, response.latLng, 'Your New Rent Point', 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png');
      this.actualMarker = marker;
      this.validator.controls['rentpoint'].setValue(this.actualMarker);
      this.googleMapsProvider.getInformationOfCoordinates(this.actualMarker.getPosition()).then((response: ILocality) => {
        this.location = response;
      }).catch(() => console.log('error en location'));
    });
  }

  ionViewWillUnload(): void {
    this.googleMapsProvider.removeEventListenerOfMap(this.mapEventListener);
    this.mapClick.unsubscribe();
    this.mapSubscription.unsubscribe();
    this.location = null;
    this.actualMarker = null;
  }

  /**
   * this method submit a new rentpoint
   */
  async submitBikes() {
    var message;
    this.translate.get("CREATERENTPOINTMESSAGE").subscribe(translated => { message = translated });
    this.toast = this.toastCtrl.create({
      message: message,
      duration: 1000,
      position: 'top'
    });
    this.toast.onDidDismiss(() => {
      this.navCtrl.setRoot(MyRentPointsPage)
    });
    let rentPoint: RentPoint;
    let currentRentPoint: IRentPoint; 
    currentRentPoint = { ...this.validator.value };
    rentPoint = new RentPoint;
    rentPoint.latitude = this.actualMarker.getPosition().lat();
    rentPoint.longitude = this.actualMarker.getPosition().lng();
    rentPoint.ownerId = Number(localStorage.getItem('userId'));
    rentPoint.country = this.location.country;
    rentPoint.city = this.location.city;
    rentPoint.direction = currentRentPoint.direction;
    rentPoint.title = currentRentPoint.title;
    this.rentProv.postRentPoint(rentPoint).subscribe(response => {
      this.toast.present();
    });
  }
}
