import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EnlistmentsProvider } from '../../providers/enlistments/enlistments';
import { EventProvider } from '../../providers/event/event';
import { Event } from '../../models/event';

/**
 * Generated class for the MyEnlistmentsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-enlistments',
  templateUrl: 'my-enlistments.html',
})
export class MyEnlistmentsPage {
  enlistments: Array<Event>;
  constructor(public navCtrl: NavController, public navParams: NavParams, public enlistServ: EnlistmentsProvider, public eventProvider: EventProvider) {
    this.enlistments = [];
    this.enlistServ.getMyEnlistment(localStorage.getItem('userId')).subscribe((res: Array<any>) => {
      for (let i = 0; i < res.length; i++) {
        this.eventProvider.getEventInfo(res[i].idEvent).subscribe((response: Event) => {
          this.enlistments.push(response);
        });
      }
    });
  }

  ionViewDidLoad() {
  }

}
