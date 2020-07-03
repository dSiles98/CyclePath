import { Component, Input } from '@angular/core';
import { NavController, AlertController, ToastController} from 'ionic-angular';
import { EditRoutePage } from '../../pages/edit-route/edit-route';
import { RoutesProvider } from '../../providers/routes/routes';
import { Route } from '../../models/route';
import { RoutePage } from '../../pages/route/route';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the RouteCardComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 * <google-map [routePoints]="account.checkpoints" #map></google-map>
 */
@Component({
  selector: 'route-card',
  templateUrl: 'route-card.html'
})
export class RouteCardComponent {
  @Input() route: Route;
  @Input() isMine: boolean;
  visible: boolean;
  private toast: any;

  /**
   * Constructor
   * @param alertCtrl 
   * @param navCtrl 
   * @param service 
   */
  constructor(private alertCtrl: AlertController, public navCtrl: NavController, public service: RoutesProvider, private toastCtrl: ToastController, public translate: TranslateService) {
    this.visible = true;
  }

  /**
   * return categorys with # on the front
   */
  getCategory() {
    let hashtag = "#";
    return hashtag += this.route.category;
  }

  /**
   * open a dialog to delete route
   */
  deleteRouteConfirm() {
    var value = { title: "", message: "" };
    var confirm;
    var cancel;
    var message;
    this.translate.get("DELETEROUTE").subscribe(translated => { value.title = translated });
    this.translate.get("DELETEROUTEMESSAGE").subscribe(translated => { value.message = translated });
    this.translate.get("CONFIRM").subscribe(translated => { confirm = translated });
    this.translate.get("CANCEL").subscribe(translated => { cancel = translated });
    this.translate.get("DELETEROUTEMESSAGESUCCESSFULLY").subscribe(translated => { message = translated });
    this.toast = this.toastCtrl.create({
      message: message,
      duration: 1000,
      position: 'top'
    });
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
            this.service.deleteRoute(this.route.id).subscribe();
            this.visible = false;
            this.toast.present();
          }
        }
      ]
    });
    alert.present();
  }

  /**
   * sent to edit route page
   */
  editRoute() {
    this.navCtrl.push(EditRoutePage, {
      idRoute: this.route.id
    })
  }

  /**
 * send to route view
 */
  goToRouteView() {
    this.navCtrl.push(RoutePage, {
      idRoute: this.route.id
    });
  }
}
