import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CreateRoutesPage } from '../create-routes/create-routes';
import { RoutesProvider } from '../../providers/routes/routes';
import { Route } from '../../models/route';

@IonicPage()
@Component({
  selector: 'page-routes',
  templateUrl: 'routes.html',
})
export class RoutesPage {
  searchBarOn: boolean;
  routesList;
  routes;
  searchTerm = '';
  items;

  /**
   * Constructor
   * @param navCtrl 
   * @param navParams 
   * @param routeService 
   */
  constructor(public navCtrl: NavController, public navParams: NavParams, public routeService: RoutesProvider) {
    this.routesList = [];
    this.items = [];
    this.searchBarOn = false;
  }

  /**
   * This method get the routes when a the page goes to the front
   */
  ionViewDidEnter() {
    this.routeService.getRoutes(this.searchTerm).subscribe(data => {
      this.routes = data;
      this.routesList = [];
      this.createRoute(data);
    });
  }

  /**
   * This method create new account routes
   * @param routes 
   */
  createRoute(routes) {
    routes.forEach((item) => {
      var user = localStorage.getItem('user');
      if (item.owner == user) {
        let route = new Route;
        route.id = item.id;
        route.owner = item.owner;
        route.category = item.category;
        route.address = item.address;
        route.date = item.date;
        route.checkpoints = item.checkpoints;
        route.city = item.city;
        this.routesList.push(route);
        this.items = this.routesList
      }
    });
  }

  /**
   * This method send to create route page
   */
  goToCreateRoute() {
    this.navCtrl.push(CreateRoutesPage);
  }

  searchRoute() {
    var user = localStorage.getItem('user');
    this.routeService.getFilteredRoutesOf(user, this.searchTerm).subscribe(response => {
      this.routesList = response;
    });
  }

  /**
   * This method enable/disable search bar
   */
  swipeSearchBar() {
    this.searchBarOn = !this.searchBarOn;
  }
}
