import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RoutesProvider } from '../../providers/routes/routes';
import { Route, IRoute } from '../../models/route';
import { Geolocation } from '@ionic-native/geolocation';
import { AndroidPermissions } from '@ionic-native/android-permissions';

/**
 * Generated class for the AllRoutesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-all-routes',
  templateUrl: 'all-routes.html',
})
export class AllRoutesPage {
  searchBarOn: boolean;
  searchTerm: string;
  routes: Array<IRoute>;
  private citySelected: string;
  constructor(public routeService: RoutesProvider, public geolocation: Geolocation, private navParams: NavParams,
    protected androidPermissions: AndroidPermissions) {
      this.searchBarOn = false;
  }

  /**
   * This method get information about current location and all routes posted.
   */
  ionViewDidLoad() {
    this.citySelected = this.navParams.get('city');
    this.searchRoute();
  }

  /**
   * This method filter routes by category
   */
  searchRoute() {
    this.routeService.getRoutes(this.searchTerm, this.citySelected).subscribe((response: Array<IRoute>) => {
      this.routes = response;
    });
  }

  /**
  * This method enable/disable search bar
  */
  swipeSearchBar() {
    this.searchBarOn = !this.searchBarOn;
  }
}
