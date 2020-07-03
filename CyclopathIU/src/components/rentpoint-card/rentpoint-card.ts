import { Component, Input } from '@angular/core';
import { RentPoint } from '../../models/rent-point';
import { AlertController, NavController, ToastController } from 'ionic-angular';
import { RentPointProvider } from '../../providers/rent-point/rent-point';
import { ModifyRentsPage } from '../../pages/modify-rents/modify-rents';
import { RentPointPage } from '../../pages/rent-point/rent-point';
import { RentPointViewPage } from '../../pages/rent-point-view/rent-point-view';
import { TranslateService } from '@ngx-translate/core';
import { MyRentPointsPage } from '../../pages/my-rent-points/my-rent-points';


@Component({
  selector: 'rentpoint-card',
  templateUrl: 'rentpoint-card.html'
})
export class RentpointCardComponent {
  @Input() isMine: boolean;
  @Input() rentPoint: RentPoint;
  text: string;
  visible: boolean;
  private toast: any;

  /**
   * Constructor
   * @param alertCtrl 
   * @param rentPointProvider 
   * @param navCtrl 
   */
  constructor(private alertCtrl: AlertController, public rentPointProvider: RentPointProvider, public navCtrl: NavController, public translate: TranslateService, private toastCtrl: ToastController) {
    this.visible = true;
  }

  /**
   * this method change the color of the start in base of the rent point rating
   * @param starNumber 
   */
  colorRating(starNumber: number): any {
    let color: string;
    color = '#7f7f7f';
    if (starNumber <= this.rentPoint.rating) {
      color = '#2699fb';
    }
    return { 'color': color }
  }
  

  /**
   * this method create a dialog to accept delete a rent point
   */
  deleteRentPointConfirm() {
    var value = { title: "", message: "", confirm: "", cancel: "", toast: "" };
    this.translate.get("DELETERENTPOINT").subscribe(translated => { value.title = translated });
    this.translate.get("DELETERENTPOINTMESSAGE").subscribe(translated => { value.message = translated });
    this.translate.get("CONFIRM").subscribe(translated => { value.confirm = translated });
    this.translate.get("CANCEL").subscribe(translated => { value.cancel = translated });
    this.translate.get("DELETERENTPOINTMESSAGESUCCESSFULLY").subscribe(translated => { value.toast = translated });
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
            this.rentPointProvider.deleteRentPoint(this.rentPoint.id).subscribe(res => {
              this.navCtrl.setRoot(MyRentPointsPage);
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
   * send to modify rent page
   */
  modifiRentPoint() {
    this.navCtrl.push(ModifyRentsPage, {
      idRent: this.rentPoint.id
    });
  }

  /**
   * send to rent point view
   */
  goToRentPointView() {
    if(this.isMine) {
      this.navCtrl.push(RentPointViewPage, {
        rentPointId: this.rentPoint.id,
        rentPointTitle: this.rentPoint.title
      });
    } else {
      this.navCtrl.push(RentPointPage, {
        idRent: this.rentPoint.id
      });
    }
  }
}
