import { Component, Input } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { Bike } from '../../models/bike';
import { AddNewBikePage } from '../../pages/add-new-bike/add-new-bike';
import { BikesProvider } from '../../providers/bikes/bikes';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'byke',
  templateUrl: 'byke.html'
})

export class BykeComponent {
  @Input() bike: Bike;
  @Input() isMine: boolean;
  visible: boolean;
  image: string;

  /**
   * Constructor
   * @param alertCtrl 
   * @param navController 
   * @param navParams 
   * @param bikeProvider 
   */
  constructor(private alertCtrl: AlertController, public navController: NavController, public navParams: NavParams, public bikeProvider: BikesProvider, public sanitizer: DomSanitizer, public translate: TranslateService) {
    this.visible = true;
  }
  showImage()
  {
    return this.sanitizer.bypassSecurityTrustUrl(this.bike.image);
  }

  /**
   * return if the bike is showable
   */
  showBike() {
    return  this.bike.disponible || this.isMine;
  }

  /**
   * send to edit bike
   */
  goToEditBike() {
    this.navController.push(AddNewBikePage, {
      bikeId: this.bike.id,
      rentPointId: this.bike.rentPointId,
      title: 'EDITBIKE'
    });
  }

  /**
   * Display a dialog to delete the bike
   */
  delete() {
    var value = { title: "", message: "" };
    var confirm;
    var cancel;
    this.translate.get("DELETEBIKE").subscribe(translated => { value.title = translated });
    this.translate.get("DELETEBIKEMESSAGE").subscribe(translated => { value.message = translated });
    this.translate.get("CONFIRM").subscribe(translated => { confirm = translated });
    this.translate.get("CANCEL").subscribe(translated => { cancel = translated });
    let alert = this.alertCtrl.create({
      title: value.title,
      message: value.message,
      buttons: [
        {
          text: cancel,
          role: 'cancel',
        },
        {
          text: confirm,
          handler: () => {
            this.bikeProvider.deleteBike(this.bike.id).subscribe();
            this.visible = false;
          }
        }
      ]
    });
    alert.present();
  }

  /**
   * Display a dialog to reserve the bike
   */
  reserve() {
    let value = { title: "", message: "" };
    let confirm;
    let cancel;
    let usage; 
    this.translate.get("RESERVEBIKE").subscribe(translated => { value.title = translated });
    this.translate.get("RESERVEBIKEMESSAGE").subscribe(translated => { value.message = translated });
    this.translate.get("CONFIRM").subscribe(translated => { confirm = translated });
    this.translate.get("CANCEL").subscribe(translated => { cancel = translated });
    this.translate.get("USAGEMESSAGE").subscribe(translated => { usage = translated });
    let alert = this.alertCtrl.create({
      title: value.title,
      message: value.message,
      inputs: [
        {
          name: 'usage',
          placeholder: usage,
          type: "number"
        },
      ],
      buttons: [
        {
          text: cancel,
          role: 'cancel',
        },
        {
          text: confirm,
          handler: () => {
            this.bike.disponible = false;
            this.bikeProvider.editBikeDisponibility(this.bike).subscribe();
          }
        }
      ]
    });
    alert.present();
  }

  /**
   * Display a dialog to change the reservation status
   */
  changeReservationStatus() {
    var value = { title: "", message: "" };
    var available;
    var unavailable;
    this.translate.get("BIKEAVAILABILITY").subscribe(translated => { value.title = translated });
    this.translate.get("BIKEAVAILABILITYMESSAGE").subscribe(translated => { value.message = translated });
    this.translate.get("AVAILABLE").subscribe(translated => { available = translated });
    this.translate.get("UNAVAILABLE").subscribe(translated => { unavailable = translated });
    let alert = this.alertCtrl.create({
      title: value.title,
      message: value.message,
      buttons: [
        {
          text: available,
          handler: () => {
            this.bike.disponible = true;
            this.bikeProvider.editBikeDisponibility(this.bike).subscribe();
          }
        },
        {
          text: unavailable,
          handler: () => {
            this.bike.disponible = false;
            this.bikeProvider.editBikeDisponibility(this.bike).subscribe();
          }
        }
      ]
    });
    alert.present();
  }

  /**
   * Get Reservation status
   */
  getReservationStatus() {
    let response: string;
    if(this.bike.disponible) {
      response = 'AVAILABLE';
    } else {
      response = 'RESERVED'
    }
    return response;
  }
}
