import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { RoutesProvider } from '../../providers/routes/routes';
import { Route, Checkpoint } from '../../models/route';
import { GoogleMapNative } from '../../models/google-map';
import { Geolocation } from '@ionic-native/geolocation';
import { RoutesPage } from '../routes/routes';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AndroidPermissions } from '@ionic-native/android-permissions';


declare var google: any

@IonicPage()
@Component({
  selector: 'page-edit-route',
  templateUrl: 'edit-route.html',
})
export class EditRoutePage extends GoogleMapNative {
  @ViewChild('map') mapRef: ElementRef;
  validator: FormGroup;
  currentMap;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });
  start;
  end;
  waypoints: Array<any>;
  checkpoints;
  private route;
  private routeModel: Route;
  map;
  id;
  markers: Array<any>;
  private direction;
  private directions: Array<any>;
  private toast: any;
  categoryValue = '';

  /**
   * Constructor
   * @param navCtrl 
   * @param navParams 
   * @param provider 
   */
  constructor(public navCtrl: NavController, public navParams: NavParams, public provider: RoutesProvider, public geolocation: Geolocation, private toastCtrl: ToastController, public translate: TranslateService, public form: FormBuilder, protected androidPermissions: AndroidPermissions) {
    super(geolocation, androidPermissions);
    this.waypoints = [];
    this.routeModel = new Route();
    this.checkpoints = [];
    this.id = this.navParams.get('idRoute');
    this.markers = [];
    this.directions = [];
    this.validator = this.form.group({
      category: ['', Validators.compose([Validators.required])],
      start: ['', Validators.compose([Validators.required])],
      end: ['', Validators.compose([Validators.required])]
    });
  }

  /**
   * This method get the route info when the page is loaded
   * @param event 
   */
  ionViewWillEnter() {
    let res = this.getGeoposition(this.mapRef);
    res.then((map) => {
      this.getRouteInfo(map);
    });
  }

  /**
   * This method get information about current route.
   * @param idRoute
   * @param map
   */
  getRouteInfo(map) {
    this.directionsDisplay.setMap(map);
    this.provider.getRoute(this.id).subscribe(response => {
      this.route = response;
      this.categoryValue = this.route.category;
      let start;
      let end;
      let waypoints = [];
      for (let number = 0; number < this.route.checkpoints.length; number++) {
        let item = this.route.checkpoints[number];
        if (number == 0) {
          start = new google.maps.LatLng(item.latitude, item.length);
          let startPin = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
          let marker = this.showMarker(start, map, startPin);
          this.markers.push(marker);
        }
        if (number == 1) {
          end = new google.maps.LatLng(item.latitude, item.length);
          let endPin = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
          let marker = this.showMarker(end, map, endPin);
          this.markers.push(marker);
        }
        else {
          let checkpoint = { location: { lat: item.latitude, lng: item.length }, stopover: true };
          waypoints.push(checkpoint);
        }
      }
      this.displayMap(start, end, waypoints);
    });
  }

  /**
   * This method set the map with a pin.
   * @param position
   * @param map
   * @param pin
   */
  showMarker(position, map, pin) {
    return new google.maps.Marker({ position, map, icon: pin });
  }

  /**
   * This method allow show the current route on the map.
   * @param start
   * @param end
   * @param waypoints
   */
  displayMap(start, end, waypoints) {
    this.validator.controls['start'].setValue(start);
    this.validator.controls['end'].setValue(end);
    this.directionsService.route({
      origin: start,
      destination: end,
      waypoints: waypoints,
      travelMode: 'WALKING'
    }, (res, status) => {

      if (status == google.maps.DirectionsStatus.OK) {
        this.directionsDisplay.setDirections(res);
      } else {
        console.warn(status);
      }

    });
  }

  /**
   * This method allow draw the new route
   */
  addNewPoint() {
    this.directionsService.route({
      origin: this.start,
      destination: this.end,
      waypoints: this.waypoints,
      travelMode: 'WALKING'
    }, (res, status) => {
      if (status == google.maps.DirectionsStatus.OK) {
        if (this.directions.length == 0) {
          let result = this.verifyComas(res.routes[0].legs[0].start_address);
          this.getAddress(result, res.routes[0].legs[0].start_address);
        }
        if (this.directions.length == 1) {
          let result = this.verifyComas(res.routes[0].legs[0].end_address);
          this.getAddress(result, res.routes[0].legs[0].end_address);
        }
        if (this.directions.length == 2) {
          var middle = res.routes[0].summary;
        }
        this.direction = this.directions[0] + '/' + this.directions[1] + ' ' + 'on' + ' ' + middle;
        this.directionsDisplay.setDirections(res);
      } else {
        console.warn(status);
      }
    });
  }

  /**
   * This method verify the address.
   * @param address
   */
  verifyComas(address) {
    let count = 0;
    for (let item of address) {
      if (item == ',') {
        count += 1;
      }
    }
    return count;
  }

  /**
   * This method save the address.
   * @param data
   * @param response
   */
  getAddress(data, response) {
    if (data > 2) {
      var address = response.split(',', 2);
      let post = address[0] + ',' + ' ' + address[1];
      this.directions.push(post);
    } else {
      var OneAddress = response.split(',', 1);
      this.directions.push(OneAddress[0]);
    }
  }

  /**
   * This method undo the last marker on the map.
   */
  undoLast() {
    if (this.markers.length > 0) {
      let number = this.markers.length - 1;
      if (number == 0) {
        this.markers[number].setVisible(false);
        this.markers[number].setMap(null);
        this.directionsDisplay.setMap(null);
        this.verifyDirectionDisplay();
        this.start = null;
        this.directions = [];
        this.validator.controls['start'].setValue(null);
        this.markers.pop();
      }
      if (number == 1) {
        this.markers[number].setVisible(false);
        this.markers[number].setMap(null);
        this.end = null;
        this.directions = [];
        this.validator.controls['end'].setValue(null);
        this.markers.pop();

      }
      if (number > 1) {
        this.markers[number].setVisible(false);
        this.markers[number].setMap(null);
        this.markers.pop();
        this.waypoints.pop();
      }
      this.addNewPoint();
    }
  }

  /**
 * This method verify that the DirectionsDisplay property directions is not undefined.
 */
  verifyDirectionDisplay() {
    if (this.directionsDisplay.directions != undefined) {
      this.directionsDisplay.directions.routes.pop();
    }
  }

  /**
   * This method mark points in the map.
   * @param event
   */
  marker(event, map) {
    this.directionsDisplay.setMap(map);
    var position = event.latLng;
    if (this.start == null) {
      this.start = position;
      let markerRed = new google.maps.Marker({ position, map, icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' });
      if (this.markers.length != 0) {
        this.markers[0].setVisible(false);
        this.markers[0].setMap(null);
      }
      this.markers[0] = markerRed;
      this.validator.controls['start'].setValue(position);
      return markerRed;
    }
    if (this.end == null) {
      this.end = position;
      let markerGreen = new google.maps.Marker({ position, map, icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' });
      if (this.markers.length == 1) {
        this.markers[1] = markerGreen;
      }
      else {
        this.markers[1].setVisible(false);
        this.markers[1].setMap(null);
      }
      this.validator.controls['end'].setValue(position);
      return markerGreen;
    }
    else {
      var item = {
        location: position,
        stopover: true
      }
      let marker = new google.maps.Marker({ position, map, icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' });
      this.markers.push(marker);
      this.waypoints.push(item);
      return marker;
    }
  }

  /**
   * This method edit the new route
   * @param category
   */
  EditRoute(category) {
    var message;
    this.translate.get("EDITROUTEMESSAGE").subscribe(translated => { message = translated });
    this.toast = this.toastCtrl.create({
      message: message,
      duration: 1000,
      position: 'top'
    });
    this.toast.onDidDismiss(() => {
      this.navCtrl.setRoot(RoutesPage)
    });
    var user = localStorage.getItem('user');
    this.routeModel.category = category;
    this.routeModel.owner = user;
    this.routeModel.address = this.direction;
    this.createCheckpoints();
    this.routeModel.checkpoints = this.checkpoints;
    this.provider.editRoute(this.id, this.routeModel).subscribe(response => { });
    this.toast.present();
  }

  /**
   * this method create the checkpoints to send.
   */
  createCheckpoints() {
    let origin = new Checkpoint;
    let destination = new Checkpoint;
    origin.latitude = this.start.lat();
    origin.length = this.start.lng();
    destination.latitude = this.end.lat();
    destination.length = this.end.lng();
    this.checkpoints.push(origin);
    this.checkpoints.push(destination);
    this.waypoints.forEach((item) => {
      let checkpoint = new Checkpoint;
      checkpoint.latitude = item.location.lat();
      checkpoint.length = item.location.lng();
      this.checkpoints.push(checkpoint);
    });
  }
}
