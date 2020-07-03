import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AllRoutesPage } from '../all-routes/all-routes';
import { RoutesProvider } from '../../providers/routes/routes';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';
import { Subscription } from 'rxjs';
import { ILocality } from '../../models/google-maps';

/**
 * Generated class for the MapAllRoutesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-map-all-routes',
  templateUrl: 'map-all-routes.html',
})
export class MapAllRoutesPage {

  private mapSubjectSubscription: Subscription = null;
  private mapClick: Subscription = null;
  private markerSelected: google.maps.Marker;
  private mapSelected: google.maps.Map;
  private mapEventListener: google.maps.MapsEventListener;

  /**
   * Constructor
   * @param navCtrl 
   * @param navParams 
   * @param rentPointProvider 
   */
  constructor(public navCtrl: NavController, public navParams: NavParams, private googleMapsProvider: GoogleMapsProvider) {}

  ionViewDidLoad(): void {
    this.mapSubjectSubscription = this.googleMapsProvider.mapSubject$.subscribe((map: google.maps.Map) => {
      this.mapSelected = map;
      this.markerSelected = this.googleMapsProvider.addMarker(this.mapSelected, this.googleMapsProvider.currentPosition, 'Your Location');
      this.mapEventListener = this.googleMapsProvider.addEventListenerToMap(this.mapSelected);
      this.mapSubjectSubscription.unsubscribe();
    });
    this.mapClick = this.googleMapsProvider.mapClick$.subscribe((response) => {
      if (this.markerSelected) {
        this.googleMapsProvider.removeMarker(this.markerSelected);
      }
      this.markerSelected = this.googleMapsProvider.addMarker(this.mapSelected, response.latLng, 'City Selected', 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png');
    });
  }
/*
  ionViewDidEnter(): void {
    console.log('enter my map route')
  }

  ionViewDidLeave(): void {
    console.log('leave my map route');
  }
*/
  ionViewWillUnload(): void {
    this.googleMapsProvider.removeEventListenerOfMap(this.mapEventListener);
    this.mapClick.unsubscribe();
    this.mapSubjectSubscription = null;
  }

  /**
   * This method send to Create Rent point page
   */
  goToAllRoutesPage() {
    this.googleMapsProvider.getInformationOfCoordinates(this.markerSelected.getPosition()).then((response: ILocality) => {
      this.navCtrl.push(AllRoutesPage, {
        city: response.city
      });
    });
  }

}
