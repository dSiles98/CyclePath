import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';
import { RentPointProvider } from '../../providers/rent-point/rent-point';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';
import { IRentPoint } from '../../models/rent-point';
import { Subscription } from 'rxjs';

@IonicPage()
@Component({
  selector: 'page-rent-points',
  templateUrl: 'rent-points.html',
})
export class RentPointsPage {

  private rentPointSubscription: Subscription = null;
  private mapSubjectSubscription: Subscription = null;
  private rentPoints: Array<google.maps.Marker> = [];
  /**
   * Constructor
   * @param navCtrl 
   * @param navParams 
   * @param rentPointProvider 
   */
  constructor(public navCtrl: NavController, public navParams: NavParams, public rentPointProvider: RentPointProvider,
    public geolocation: Geolocation, protected androidPermissions: AndroidPermissions,
    private googleMapsProvider: GoogleMapsProvider) {
  }

  /**
   * this method get the rentpoints of the server, and show like marker on the map.
   */
  ionViewDidLoad(): void {
    this.mapSubjectSubscription = this.googleMapsProvider.mapSubject$.subscribe((map: google.maps.Map) => {
      this.googleMapsProvider.addMarker(map, this.googleMapsProvider.currentPosition, 'Your Location');
      this.rentPointSubscription = this.rentPointProvider.getRentPoints().subscribe((response: Array<IRentPoint>) => {
        response.forEach((element: IRentPoint) => {
          let position: google.maps.LatLng = new google.maps.LatLng(element.latitude, element.longitude);
          let marker: google.maps.Marker = this.googleMapsProvider.addMarker(map, position, element.title, 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png');
          this.googleMapsProvider.addEventListenerToMarker(marker, element);
          this.rentPoints = [...this.rentPoints, marker];
        });
      });
    });
  }

  ionViewWillUnload(): void {
    this.mapSubjectSubscription.unsubscribe();
    this.rentPointSubscription.unsubscribe();
    this.rentPoints.forEach((element: google.maps.Marker) => this.googleMapsProvider.removeMarker(element));
  }
}
