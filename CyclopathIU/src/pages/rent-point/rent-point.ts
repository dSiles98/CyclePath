import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup } from '@angular/forms';
import { RentPoint } from '../../models/rent-point';
import { RentPointProvider } from '../../providers/rent-point/rent-point';
import { UsersProvider } from '../../providers/users/users';
import { Account } from '../../models/account';
import { BikesProvider } from '../../providers/bikes/bikes';
import { Bike } from '../../models/bike';


@IonicPage()
@Component({
  selector: 'page-rent-point',
  templateUrl: 'rent-point.html',
})
export class RentPointPage {

  @ViewChild('map') mapRef: ElementRef;
  validator: FormGroup;
  rentPoint: RentPoint;
  title: string;
  direction: string;
  owner: Account;
  bikes: Array<any>;

  /**
   * Constructor
   * @param navCtrl 
   * @param navParams 
   * @param bikesServ 
   * @param rentProv 
   * @param userServ 
   */
  constructor(public navCtrl: NavController, public navParams: NavParams, public bikesServ: BikesProvider,
    public rentProv: RentPointProvider, public userServ: UsersProvider) {
    this.owner = new Account();
  }

  /**
   * This method get a rentpoint and his info
   * @param idRent 
   */
  ionViewDidLoad(): void {
    this.getRentInfo(this.navParams.get('idRent'));
  }

  getRentInfo(idRent) {
    this.rentProv.getRentPoitnInfo(idRent).subscribe((response: RentPoint) => {
      this.rentPoint = response;
      this.title = this.rentPoint.title;
      this.direction = this.rentPoint.direction;
      this.userServ.getUsers().subscribe((response: Array<Account>) => {
        this.owner = response.filter((item) => {
          return item.id == this.rentPoint.ownerId;
        })[0];
      });
      this.bikesServ.getBikesOf(this.rentPoint.id).subscribe((response: Array<Bike>) => {
        this.bikes = response;
      });
    });
  }
}
