import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EventProvider } from '../../providers/event/event';
import { CreateEventPage } from '../create-event/create-event';


@IonicPage()
@Component({
  selector: 'page-my-events',
  templateUrl: 'my-events.html',
})
export class MyEventsPage {
  events;
  searchBarOn: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public eventProvider: EventProvider) {
    this.searchBarOn = false;
  }

  ionViewDidEnter() {
    this.eventProvider.getMyOwnEvents(Number(localStorage.getItem('userId'))).subscribe(response => {
      this.events = response;
    });
  }

  goToCreateEvent() {
    this.navCtrl.push(CreateEventPage);
  }

  swipeSearchBar() {
    this.searchBarOn = !this.searchBarOn;
  }

}
