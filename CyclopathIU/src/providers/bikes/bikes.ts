import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Bike, IBike } from '../../models/bike';
import { AppConfigurations } from '../../assets/configuration';
import { AuthenticationProvider } from '../authentication/authentication';
import { Subscription } from 'rxjs';


@Injectable()
export class BikesProvider {

  public url: string;
  public token: string;
  private tokenSubscription: Subscription = null;
  /**
   * Constructor 
   * @param http 
   */
  constructor(public http: HttpClient, public authProvider: AuthenticationProvider)
  {
    this.url = new AppConfigurations().url;
    this.token = localStorage.getItem('token');
    this.tokenSubscription = this.authProvider.tokenSubject$.subscribe((token: string) => {
      this.token = token;
    });
  }

  /**
   * This method post a new bike
   * @param data 
   */
  public postBike(data: IBike) {
    return this.http.post(`${this.url}api/rent-point/${data.rentPointId}/bikes`, data, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    });
  }

  /**
   * This method edit description and price of a bike
   * @param data 
   */
  public editBike(data: IBike) {
    return this.http.put(`${this.url}api/rent-point/${data.rentPointId}/bikes/${data.id}`, data, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    });
  }

  /**
   * This method edit disponibility of a bike
   * @param data 
   */
  public editBikeDisponibility(data: IBike) {
    return this.http.put(`${this.url}api/bikes/${data.id}`, data, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    });
  }

  /**
   * This method delete a bike
   * @param bikeId 
   */
  public deleteBike(bikeId: number) {
    return this.http.delete(`${this.url}api/bikes/${bikeId}`, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    });
  }

  /**
   * This method get bikes of a rentpoint
   * @param rentPointId 
   */
  public getBikesOf(rentPointId: number) {
    return this.http.get(`${this.url}api/rent-point/${rentPointId}/bikes`, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    });
  }

  /**
   * This method get a bike of a rentpoint
   * @param rentPointId 
   * @param bikeId 
   */
  public getBike(rentPointId: number, bikeId: number) {
    return this.http.get(`${this.url}api/rent-point/${rentPointId}/bikes/${bikeId}`, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    });
  }
}
