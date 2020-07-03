import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EventProvider } from '../../providers/event/event';

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage {
  public events;
  searchBarOn: boolean;


  constructor(public navCtrl: NavController, public navParams: NavParams, public eventProvider: EventProvider) {
  }

  /**
   * This method loads all the events
   */
  ionViewDidLoad() {
    this.eventProvider.getEvents().subscribe(response => {
      this.events = response;
    });
  }
  swipeSearchBar() {
    this.searchBarOn = !this.searchBarOn;
  }

}
