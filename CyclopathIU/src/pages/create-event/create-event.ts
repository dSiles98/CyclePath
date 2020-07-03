import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation';
import { RoutesProvider } from '../../providers/routes/routes';
import { IEvent, Event } from '../../models/event';
import { EventProvider } from '../../providers/event/event';
import { Select } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { MyEventsPage } from '../my-events/my-events';
import { DateTime } from 'ionic-angular/components/datetime/datetime';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { IRoute, ICheckpoint } from '../../models/route';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';
import { Subscription } from 'rxjs';

@IonicPage()
@Component({
  selector: 'page-create-event',
  templateUrl: 'create-event.html',
})


export class CreateEventPage {
  @ViewChild(Select) select: Select;
  @ViewChild('dateTime') dateTime: DateTime;
  public validator : FormGroup;
  private actualMarker: google.maps.Marker;
  private routesList: Array<IRoute>;
  private selectedRouteId: number;
  private mapClick: Subscription = null;
  private mapSubscription: Subscription = null;
  private mapSelected: google.maps.Map;
  private mapEventListener: google.maps.MapsEventListener;
  toast;
  min;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
    public geolocation: Geolocation, public routeService: RoutesProvider, public eventService: EventProvider,
    public translate: TranslateService, private toastCtrl: ToastController, protected androidPermissions: AndroidPermissions,
    private googleMapsProvider: GoogleMapsProvider) 
  {
    this.validator = this.formBuilder.group({
      name: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      eventDate: [new Date(), Validators.required],
      route: ['', Validators.compose([Validators.required])],
      point: ['', Validators.compose([Validators.required])]
    });
  }

  /**
 * This method get my position and gets the routes by owner id when the page is loaded
 */
  ionViewDidLoad(): void {
    let user: string = localStorage.getItem('user');
    this.validator.controls['eventDate'].setValue(this.getCurrentDate());
    this.routeService.getRoutesOf(user).subscribe((response: Array<IRoute>) => {
      this.routesList = response;
    });
    this.mapSubscription = this.googleMapsProvider.mapSubject$.subscribe((map: google.maps.Map) => {
      this.mapSelected = map;
      this.googleMapsProvider.addMarker(this.mapSelected, this.googleMapsProvider.currentPosition, 'Your Position');
      this.mapEventListener = this.googleMapsProvider.addEventListenerToMap(this.mapSelected);
    });
    this.mapClick = this.googleMapsProvider.mapClick$.subscribe((response) => {
      if (this.actualMarker) {
        this.googleMapsProvider.removeMarker(this.actualMarker);
      }
      var marker = this.googleMapsProvider.addMarker(this.mapSelected, response.latLng, 'Meeting Point', 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png');
      this.actualMarker = marker;
      this.validator.controls['point'].setValue(this.actualMarker);
    });
  }

  ionViewWillUnload(): void {
    this.googleMapsProvider.removeEventListenerOfMap(this.mapEventListener);
    this.mapClick.unsubscribe();
    this.mapSubscription.unsubscribe();
    this.actualMarker = null;
  }

  /**
   * This method returns the current date.
   */
  getCurrentDate() {
    let date = new Date().toISOString().split('T', 1);
    this.min = date[0];
    return this.min;
  }

  getCreateNextEvent() {
    let date = new Date().toISOString().split('T', 1);
    let max = date[0].split('-', 1);
    let currentYear = Number(max[0]);
    return currentYear + 2;
  }

  /**
   * This method allow get the value from the Select Option Component.
   */
  changeRoute(event): void {
    this.routeService.getRoute(this.select.value).subscribe((response: IRoute) => {
      this.validator.controls['route'].setValue(response);
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

  /**
   * this method submit a new Event
   */
  async submitEvent() {
    var value;
    this.translate.get("CREATEEVENTMESSAGE").subscribe(translated => { value = translated });
    this.toast = this.toastCtrl.create({
      message: value,
      duration: 1000,
      position: 'top'
    });
    let myEvent: Event;
    let currentEvent: IEvent
    currentEvent = { ...this.validator.value };
    myEvent = new Event;
    myEvent.name = currentEvent.name;
    myEvent.latitude = this.actualMarker.getPosition().lat();
    myEvent.longitude = this.actualMarker.getPosition().lng();
    myEvent.ownerId = Number(localStorage.getItem('userId'));
    myEvent.routeId = this.selectedRouteId;
    myEvent.eventDate = new Date(currentEvent.eventDate).toLocaleDateString();
    this.eventService.postEvent(myEvent).subscribe(response => {
      this.toast.present();
      this.navCtrl.setRoot(MyEventsPage);
    });
  }
}
