import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams, ToastController } from 'ionic-angular';
import { Account } from '../../models/account';
import { EventProvider } from '../../providers/event/event';
import { Event, IEvent, IEnlistment } from '../../models/event';
import { UsersProvider } from '../../providers/users/users';
import { RoutesProvider } from '../../providers/routes/routes';
import { Route, ICheckpoint, IRoute } from '../../models/route';
import { EnlistmentsProvider } from '../../providers/enlistments/enlistments';
import { AccountPage } from '../account/account';
import { MyEnlistmentsPage } from '../my-enlistments/my-enlistments';
import { Geolocation } from '@ionic-native/geolocation';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';
import { Subscription } from 'rxjs';

@IonicPage()
@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
})
export class EventPage {

  owner: Account;
  event: Event;
  name: string;
  eventDate: string;
  routeName: string;
  creator: string;
  participants: Array<Account>;
  private enlistments: Array<IEnlistment>;
  private markers: Array<any>;
  private route: IRoute;
  private address: string;
  private actualMarker: google.maps.Marker;
  private mapSubscription: Subscription = null;
  private mapSelected: google.maps.Map;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public eventProvider: EventProvider, public userServ: UsersProvider, public enlistServ: EnlistmentsProvider,
    public routeProvider: RoutesProvider, public alertCtrl: AlertController, public toastCtrl: ToastController,
    public geolocation: Geolocation, protected androidPermissions: AndroidPermissions, private googleMapsProvider: GoogleMapsProvider) {
    this.owner = new Account();
    this.participants = [];
    this.enlistments = [];
    this.markers = [];
  }

  ionViewDidLoad() {
    this.mapSubscription = this.googleMapsProvider.mapSubject$.subscribe((map: google.maps.Map) => {
      this.mapSelected = map;
      this.googleMapsProvider.addMarker(this.mapSelected, this.googleMapsProvider.currentPosition, 'Your Position');
      this.getEventInfo(this.navParams.get('idEvent'));
    });
  }

  ionViewWillUnload(): void {
    this.mapSubscription.unsubscribe();
    this.actualMarker = null;
  }
  
  isEnlisted() {
    let me = parseInt(localStorage.getItem('userId'))
    return this.participants.some(e => e.id === me);
  }

  getEventInfo(idEvent: number): void {
    this.eventProvider.getEventInfo(idEvent).subscribe((responseEvent: IEvent) => {
      this.event = responseEvent;
      this.name = this.event.name;
      this.eventDate = this.event.eventDate;
      let position = new google.maps.LatLng(this.event.latitude, this.event.longitude);
      let marker: google.maps.Marker = this.googleMapsProvider.addMarker(this.mapSelected, position, 'Meeting Point', 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png');
      this.actualMarker = marker;
      this.showRoute(this.event.routeId);
      this.userServ.getUserById(this.event.ownerId).subscribe((response: Account) => {
        this.owner = response;
      });
      this.routeProvider.getRoute(this.event.routeId).subscribe((response: IRoute) =>{
        this.routeName = response.category;
      });
      this.enlistServ.getEnlistment(this.event.id).subscribe((response: Array<IEnlistment>) => {
        this.enlistments = response;
        this.enlistments.forEach((element: IEnlistment) => {
          this.userServ.getUserById(element.idAccount).subscribe((result: Account) => {
            this.participants = [...this.participants, result];
          });
        });
      });
    });
  }

  showRoute(routeId: number): void {
    this.routeProvider.getRoute(routeId).subscribe((response: IRoute) => {
      this.route = response;
      this.address = this.route.address;
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
   * this method send to the profile page of a user
   * @param username 
   */
  GotoProfile(username) {
    this.navCtrl.push(AccountPage, { username: username.username, isFriend: false });
  }

  /**
   * this method send to the profile page of a user
   * @param username 
   */
  enlist() {
    let toast = this.toastCtrl.create({
      message: 'joined to the event successfully',
      duration: 1500,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      this.navCtrl.setRoot(EventPage, {idEvent: this.event.id})
    });

    let enlistment = {
      idAccount: parseInt(localStorage.getItem('userId')),
      idEvent: this.event.id
    };
    let alert = this.alertCtrl.create({
      title: 'are you shure?',
      buttons: [
        {
          text: 'cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'confirm',
          handler: data => {
            this.enlistServ.postEnlistment(enlistment).subscribe(res => {
              toast.present();
            });
          }
        }
      ]
    });
    alert.present();
  }

  unlist() {

    let toast = this.toastCtrl.create({
      message: 'you quit like a coward',
      duration: 1500,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      this.navCtrl.setRoot(MyEnlistmentsPage)
    });
    let me = parseInt(localStorage.getItem('userId'));
    let enlistment = this.enlistments.filter(e => e.idAccount === me)[0];
    let alert = this.alertCtrl.create({
      title: 'are you shure?',
      buttons: [
        {
          text: 'cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'confirm',
          handler: data => {
            this.enlistServ.deleteEnlistment(enlistment.id).subscribe(res => {
              toast.present();
            });
          }
        }
      ]
    });
    alert.present();
  }
}
