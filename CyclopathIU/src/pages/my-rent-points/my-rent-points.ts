import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RentPointProvider } from '../../providers/rent-point/rent-point';
import { CreateRentPointPage } from '../create-rent-point/create-rent-point';
import { Geolocation } from '@ionic-native/geolocation';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';
import { Subscription } from 'rxjs';
import { IRentPoint } from '../../models/rent-point';

@IonicPage()
@Component({
  selector: 'page-my-rent-points',
  templateUrl: 'my-rent-points.html',
})
export class MyRentPointsPage {

  private rentPointSubscription: Subscription = null;
  private mapSubjectSubscription: Subscription = null;
  private rentPoints: Array<google.maps.Marker> = [];
  private mapSelected: google.maps.Map;

  /**
   * Constructor
   * @param navCtrl 
   * @param navParams 
   * @param rentPointProvider 
   */
  constructor(public navCtrl: NavController, public navParams: NavParams, public rentPointProvider: RentPointProvider,
    public geolocation: Geolocation, protected androidPermissions: AndroidPermissions, private googleMapsProvider: GoogleMapsProvider) {
    this.rentPoints = [];
  }

  ionViewDidLoad(): void {
    this.mapSubjectSubscription = this.googleMapsProvider.mapSubject$.subscribe((map: google.maps.Map) => {
      this.mapSelected = map;
      this.googleMapsProvider.addMarker(this.mapSelected, this.googleMapsProvider.currentPosition, 'Your Location');
      this.getMyRentPoints();
      this.mapSubjectSubscription.unsubscribe();
    });
  }

  ionViewDidEnter(): void {
    if (this.rentPointSubscription === null) {
      this.getMyRentPoints();
    }
  }

  ionViewDidLeave(): void {
    if (this.rentPointSubscription) {
      this.rentPointSubscription.unsubscribe();
      this.rentPointSubscription = null;
    }
    this.rentPoints.forEach((element: google.maps.Marker) => this.googleMapsProvider.removeMarker(element));
  }

  ionViewWillUnload(): void {
    this.mapSubjectSubscription = null;
  }

  getMyRentPoints(): void {
    let userId: number = Number(localStorage.getItem('userId'));
    this.rentPointSubscription = this.rentPointProvider.getMyOwnRentPoints(userId).subscribe((response: Array<IRentPoint>) => {
      response.forEach((element: IRentPoint) => {
        let position: google.maps.LatLng = new google.maps.LatLng(element.latitude, element.longitude);
        let marker: google.maps.Marker = this.googleMapsProvider.addMarker(this.mapSelected, position, element.title, 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png');
        this.googleMapsProvider.addEventListenerToMarker(marker, element, true);
        this.rentPoints = [...this.rentPoints, marker];
      });
    });
  }

  /**
   * This method send to Create Rent point page
   */
  goToCreateRoute() {
    this.navCtrl.push(CreateRentPointPage);
  }
}
