import { Component, Input } from '@angular/core';
import { Event } from '../../models/event';
import { AlertController, NavController, ToastController } from 'ionic-angular';
import { EventProvider } from '../../providers/event/event';
import { EditEventPage } from '../../pages/edit-event/edit-event';
import { EventPage } from '../../pages/event/event';
import { TranslateService } from '@ngx-translate/core';
import { MyEventsPage } from '../../pages/my-events/my-events';


@Component({
  selector: 'event-card',
  templateUrl: 'event-card.html'
})
export class EventCardComponent {

  @Input() isMine: boolean;
  @Input() event: Event;
  text: string;
  visible: boolean;
  toast;

  constructor(private alertCtrl: AlertController, private eventProvider: EventProvider, public navCtrl: NavController, public translate: TranslateService, private toastCtrl: ToastController) {
    this.visible = true;
  }

  /**
   * this method create a dialog to accept delete an event
   */
  deleteEvent() {
    var value = { title: "", message: "", confirm: "", cancel: "", toast: "" };
    this.translate.get("DELETEEVENT").subscribe(translated => { value.title = translated });
    this.translate.get("DELETEEVENTMESSAGE").subscribe(translated => { value.message = translated });
    this.translate.get("CONFIRM").subscribe(translated => { value.confirm = translated });
    this.translate.get("CANCEL").subscribe(translated => { value.cancel = translated });
    this.translate.get("DELETEEVENTMESSAGESUCCESSFULLY").subscribe(translated => { value.toast = translated });
    this.toast = this.toastCtrl.create({
      message: value.toast,
      duration: 1000,
      position: 'top'
    });
    let alert = this.alertCtrl.create({
      title: value.title,
      message: value.message,
      buttons: [
        {
          text: value.cancel,
          role: 'cancel',
        },
        {
          text: value.confirm,
          handler: () => {
            this.eventProvider.deleteEvent(this.event.id).subscribe(response => {
              this.navCtrl.setRoot(MyEventsPage);
              this.visible = false;
              this.toast.present();
            });
          }
        }
      ]
    });
    alert.present();
  }

  /**
   * send to modify Event page
   */
  modifiEvent() {
    this.navCtrl.push(EditEventPage, {
      idEvent: this.event.id
    });
  }

  /**
   * send to rent Event view
   */
  goToEventView() {
    this.navCtrl.push(EventPage, {
      idEvent: this.event.id
    });
  }

}
