import { Component, ViewChild, ElementRef  } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { RoutesProvider } from '../../providers/routes/routes';
import { Route, Checkpoint } from '../../models/route';
import { GoogleMapNative } from '../../models/google-map';
import { Geolocation } from '@ionic-native/geolocation';
import { RoutesPage } from '../routes/routes';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { rejects } from 'assert';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-create-routes',
  templateUrl: 'create-routes.html',
})
export class CreateRoutesPage extends GoogleMapNative {
  @ViewChild('map') mapRef: ElementRef;
  validator: FormGroup;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });
  start;
  end;
  waypoints: Array<any>;
  checkpoints;
  private route: Route;
  private markers: Array<any>;
  private direction;
  private directions: Array<any>;
  private toast: any;
  private checkpointIntermedly: Array<any>;
  
  /**
   * Constructor 
   * @param navCtrl 
   * @param navParams 
   * @param provider 
   */
  constructor(public navCtrl: NavController, public navParams: NavParams, public provider: RoutesProvider, public geolocation: Geolocation, private toastCtrl: ToastController, public translate: TranslateService, public form: FormBuilder, protected androidPermissions: AndroidPermissions) {
    super(geolocation, androidPermissions);
    this.waypoints = [];
    this.checkpointIntermedly = [];
    this.route = new Route();
    this.checkpoints = [];
    this.markers = [];
    this.directions = [];
    this.validator = this.form.group({
      category: ['', Validators.compose([Validators.required])],
      start: ['', Validators.compose([Validators.required])],
      end: ['', Validators.compose([Validators.required])]
    });
  }

  /**
   * This method load the page.
   */
  ionViewWillEnter() {
    this.getGeoposition(this.mapRef);
  }


  /**
   * This method draw the route on the map.
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
          this.checkpointIntermedly.push(middle);
          console.log('middle', middle);
          console.log('intemedly', this.checkpointIntermedly);
        }
        this.direction = this.directions[0] + '/' + this.directions[1] + ' ' + 'on' + ' ' + middle;
        this.directionsDisplay.setDirections(res);
      } else {
        console.warn(status);
      }
    });
    console.log('list', this.directions);
    console.log('this direction', this.direction, 'middle');
    console.log('display', this.directionsDisplay);
  }

  /**
   * This mehtod Verify the address.
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
      var addressWithTwoAddress = response.split(',', 1);
      this.directions.push(addressWithTwoAddress[0]);
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
        this.markers.pop();
        this.validator.controls['start'].setValue(null);
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
   * This method allow mark a point on the map.
   * @param event
   */
  marker(event, map) {
    this.directionsDisplay.setMap(map);
    var position = event.latLng;
    if (this.start == null) {
      this.start = position;
      let markerRed = new google.maps.Marker({ position, map, icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' });
      this.markers.push(markerRed);
      this.validator.controls['start'].setValue(position);
      return markerRed;
    }
    
    if (this.end == null) {
      this.end = position;
      let markerGreen = new google.maps.Marker({ position, map, icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' });
      this.markers.push(markerGreen);
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
   * This method allow create routes.
   * @param data
   */
  createRoute(data) {
    var message;
    let answer : Promise<{}>;
    this.translate.get("CREATEROUTEMESSAGE").subscribe(translated => { message = translated });
    this.toast = this.toastCtrl.create({
      message: message,
      duration: 1000,
      position: 'top'
    });
    this.toast.onDidDismiss(() => {
      this.navCtrl.setRoot(RoutesPage)
    });
    answer = this.getInformationCountry(this.markers[0].position.lat(), this.markers[0].position.lng());
    answer.then(response => {
      var user = localStorage.getItem('user');
      this.route.category = data;
      this.route.owner = user;
      this.route.country = response['country'];
      this.route.city = response['city'];
      this.route.address = this.direction;
      this.route.date = new Date().toLocaleDateString();
      this.createCheckpoints();
      this.route.checkpoints = this.checkpoints;
      this.provider.postRoute(this.route).subscribe(data => { });
      this.toast.present();
    }).catch(error => {
        console.log(error);
    })
}

  /**
   * This method create new checkpoints.
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
