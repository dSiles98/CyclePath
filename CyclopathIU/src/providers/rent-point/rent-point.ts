import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { AppConfigurations } from '../../assets/configuration';
import { Subscription } from 'rxjs';
import { AuthenticationProvider } from '../authentication/authentication';


@Injectable()
export class RentPointProvider {

  public url: string;
  public token: string;
  private tokenSubscription: Subscription = null;
  
  /**
   * Constructor
   * @param http 
   */
  constructor(public http: HttpClient, public authProvider: AuthenticationProvider)
  {
    this.url = new AppConfigurations().url + 'api/rent-point';
    this.token = localStorage.getItem('token');
    this.tokenSubscription = this.authProvider.tokenSubject$.subscribe((token: string) => {
      this.token = token;
    });
  }

  /**
   * This method post a new rentpoint
   * @param data 
   */
  public postRentPoint(data: any) {
    return this.http.post(this.url, data,
      {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + this.token
        })
      }
      );
  }

  /**
   * this method get all the rentpoints of the server
   */
  public getRentPoints() {
    return this.http.get(this.url, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    });
  }
  
  /**
   * This method get a rentpoint
   * @param id 
   */
  public getRentPoitnInfo(id: number) {
    return this.http.get(this.url + '/' + id, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    });
  }

  /**
   * This method put a new rentpoint
   * @param data 
   * @param id 
   */
  public putRentPoint(data: any, id: number) {
    return this.http.put(this.url + '/' + id, data, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    });
  }

  /**
   * this method get the rentpoints of a user
   * @param ownerId 
   */
  public getMyOwnRentPoints(ownerId: number) {
    return this.http.get( this.url + '?ownerid=' + ownerId, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    });
  }

  /**
   * this method delete a rent point of the serve by his id
   * @param id 
   */
  public deleteRentPoint (id: number) {
    return this.http.delete(this.url + '/' + id, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    });
  }
}
