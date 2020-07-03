import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { RoutesProvider } from '../../providers/routes/routes';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';
import { Subscription } from 'rxjs';
import { IRoute, ICheckpoint } from '../../models/route';

/**
 * Generated class for the RoutePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-route',
  templateUrl: 'route.html',
})
export class RoutePage {
  
  private idRoute: number;
  private route: IRoute;
  private category: string;
  private address: string;
  public city: string;
  private mapSubscription: Subscription = null;
  private mapSelected: google.maps.Map;

  constructor(public navCtrl: NavController, public navParams: NavParams, public routeService: RoutesProvider,
    public geolocation: Geolocation, protected androidPermissions: AndroidPermissions, private googleMapsProvider: GoogleMapsProvider) {
    this.idRoute = this.navParams.get('idRoute');
  }

  ionViewDidLoad() {
    this.mapSubscription = this.googleMapsProvider.mapSubject$.subscribe((map: google.maps.Map) => {
      this.mapSelected = map;
      this.googleMapsProvider.addMarker(this.mapSelected, this.googleMapsProvider.currentPosition, 'Your Position');
      this.showRoute(this.idRoute);
    });
  }

  ionViewWillUnload(): void {
    this.mapSubscription.unsubscribe();
  }
  
  showRoute(routeId: number): void {
    this.routeService.getRoute(routeId).subscribe((response: IRoute) => {
      this.route = response;
      this.category = this.route.category;
      this.address = this.route.address;
      this.city = this.route.city;
      let checkpoints: Array<ICheckpoint> = response.checkpoints;
      let origin: google.maps.LatLng = new google.maps.LatLng(checkpoints[0].latitude, checkpoints[0].length);
      this.googleMapsProvider.addMarker(this.mapSelected, origin, 'Start', 'http://maps.google.com/mapfiles/ms/icons/red-dot.png');
      let destiny: google.maps.LatLng = new google.maps.LatLng(checkpoints[1].latitude, checkpoints[1].length);
      this.googleMapsProvider.addMarker(this.mapSelected, destiny, 'Finish', 'http://maps.google.com/mapfiles/ms/icons/green-dot.png');
      checkpoints.splice(0, 2);
      this.getRouteToMap(checkpoints).then((response: Array<google.maps.DirectionsWaypoint>) => {
        this.googleMapsProvider.drawRoute(this.mapSelected, origin, destiny, response);
      });
    });
  }

  getRouteToMap(checkpoints: Array<ICheckpoint>): Promise<Array<google.maps.DirectionsWaypoint>> {
    return new Promise((resolve, reject) => {
      let waypoints: Array<google.maps.DirectionsWaypoint> = [];
      checkpoints.forEach((element:ICheckpoint) => {
        let location: google.maps.LatLng = new google.maps.LatLng(element.latitude, element.length);
        let point: google.maps.DirectionsWaypoint = {location: location, stopover: true};
        waypoints = [...waypoints, point];
      });
      return resolve(waypoints);
    });
  }
}
