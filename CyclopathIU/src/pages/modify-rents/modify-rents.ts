import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IRentPoint, RentPoint } from '../../models/rent-point';
import { RentPointProvider } from '../../providers/rent-point/rent-point';
import { MyRentPointsPage } from '../my-rent-points/my-rent-points';
import { TranslateService } from '@ngx-translate/core';
import { Geolocation } from '@ionic-native/geolocation';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';
import { Subscription } from 'rxjs';
import { ILocality } from '../../models/google-maps';
import { GoogleMapOptions } from '@ionic-native/google-maps';

@IonicPage()
@Component({
  selector: 'page-modify-rents',
  templateUrl: 'modify-rents.html',
})
export class ModifyRentsPage {

  validator: FormGroup;
  private title: string;
  private direction: string;
  toast;
  private actualMarker: google.maps.Marker;
  private location: ILocality;
  private mapClick: Subscription = null;
  private mapSubscription: Subscription = null;
  private mapSelected: google.maps.Map;
  private mapEventListener: google.maps.MapsEventListener;

  /**
   * Constructor
   * @param navCtrl 
   * @param navParams 
   * @param form 
   * @param rentProv 
   * @param googleMaps 
   */
  constructor(public navCtrl: NavController, public navParams: NavParams, public form: FormBuilder,
    public rentProv: RentPointProvider, public geolocation: Geolocation, public translate: TranslateService,
    private toastCtrl: ToastController, protected androidPermissions: AndroidPermissions, private googleMapsProvider: GoogleMapsProvider) {
    this.validator = this.form.group({
      title: ['', Validators.compose([Validators.maxLength(50), Validators.pattern('[a-zA-Z0-9 ./]*'), Validators.required])],
      direction: ['', Validators.compose([Validators.maxLength(100), Validators.pattern('[a-zA-Z0-9 ./]*'), Validators.required])],
      rentpoint: ['', Validators.compose([Validators.required])]
    });
  }

  ionViewDidLoad() {
    this.mapSubscription = this.googleMapsProvider.mapSubject$.subscribe((map: google.maps.Map) => {
      this.mapSelected = map;
      this.googleMapsProvider.addMarker(this.mapSelected, this.googleMapsProvider.currentPosition, 'Your Position');
      this.getRentPointInfo(this.navParams.get('idRent'));
      this.mapEventListener = this.googleMapsProvider.addEventListenerToMap(this.mapSelected);
    });
    this.mapClick = this.googleMapsProvider.mapClick$.subscribe((response) => {
      if (this.actualMarker) {
        this.googleMapsProvider.removeMarker(this.actualMarker);
      }
      let marker = this.googleMapsProvider.addMarker(this.mapSelected, response.latLng, 'Your New Rent Point', 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png');
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

  getRentPointInfo(rentPointId: number)
  {
    this.rentProv.getRentPoitnInfo(rentPointId).subscribe((response: IRentPoint) => {
      let latLng: google.maps.LatLng = new google.maps.LatLng(response.latitude, response.longitude)
      let marker = this.googleMapsProvider.addMarker(this.mapSelected, latLng, 'Your Old Rent Point', 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png');
      this.actualMarker = marker;
      this.validator.controls['rentpoint'].setValue(this.actualMarker);
      this.title = response.title;
      this.validator.controls['title'].setValue(this.title);
      this.direction = response.direction;
      this.validator.controls['direction'].setValue(this.direction);
      this.location = {country: response.country, city: response.city, state: null};
      this.mapSelected.setCenter(this.actualMarker.getPosition());
    });
  }

  /**
   * This method edit the rentpoint
   */
  editRentpoint() {
    let value;
    this.translate.get("EDITRENTPOINTMESSAGE").subscribe(translated => { value = translated });
    this.toast = this.toastCtrl.create({
      message: value,
      duration: 1000,
      position: 'top'
    });
    let rentPoint: RentPoint;
    let currentRentPoint: IRentPoint;
    currentRentPoint = { ...this.validator.value };
    rentPoint = new RentPoint;
    rentPoint.latitude = this.actualMarker.getPosition().lat();
    rentPoint.longitude = this.actualMarker.getPosition().lng();
    rentPoint.ownerId = Number(localStorage.getItem('userId'));
    rentPoint.direction = currentRentPoint.direction;
    rentPoint.country = this.location.country;
    rentPoint.city = this.location.city;
    rentPoint.title = currentRentPoint.title;
    this.rentProv.putRentPoint(rentPoint, this.navParams.get('idRent')).subscribe(response => {
      this.navCtrl.setRoot(MyRentPointsPage);
      this.toast.present();
    });
  }
}
