import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AddNewBikePage } from '../add-new-bike/add-new-bike';
import { BikesProvider } from '../../providers/bikes/bikes';
import { Bike } from '../../models/bike';


@IonicPage()
@Component({
  selector: 'page-rent-point-view',
  templateUrl: 'rent-point-view.html',
})
export class RentPointViewPage {
  title: string;
  bikes: Array<any>;
  searchBarOn: boolean;

  /**
   * Constructor
   * @param navCtrl 
   * @param navParams 
   * @param bikesProvider 
   */
  constructor(public navCtrl: NavController, public navParams: NavParams, public bikesProvider: BikesProvider) {
    this.title = navParams.get('rentPointTitle');
    this.searchBarOn = false;
  }

  /**
   * This method get bikes of a rent point when the page goes to the front
   */
  ionViewDidEnter() {
    this.bikesProvider.getBikesOf(this.navParams.get('rentPointId')).subscribe((response: Array<Bike>) => {
      this.bikes = response;
    });
  }
  
  /**
   * This method send to add new bike
   */
  goToAddBike() 
  {
    this.navCtrl.push(AddNewBikePage, {
      rentPointId: this.navParams.get('rentPointId'),
      title: 'ADDNEWBIKE'
    });
  }

  /**
   * This method enable/disable search bar
   */
  swipeSearchBar() {
    this.searchBarOn = !this.searchBarOn;
  }
}
