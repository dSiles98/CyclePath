import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { AppConfigurations } from '../../assets/configuration';
import { Subscription } from 'rxjs';
import { AuthenticationProvider } from '../authentication/authentication';

/*
  Generated class for the EnlistmentsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EnlistmentsProvider {
  public url: string;
  public token: string;
  private tokenSubscription: Subscription = null;

  constructor(public http: HttpClient, public authProvider: AuthenticationProvider) {
    this.url = new AppConfigurations().url + 'api/enlistments/';
    this.token = localStorage.getItem('token');
    this.tokenSubscription = this.authProvider.tokenSubject$.subscribe((token: string) => {
      this.token = token;
    });
  }

  /**
   * This method enlist a user to a event
   * @param data 
   */
  public postEnlistment(data) {
    return this.http.post(this.url, data, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    });
  }

  /**
   * This method get the enlistments of a event
   * @param data 
   */
  public getEnlistment(idEvent) {
    return this.http.get(this.url + idEvent, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    });
  }

  /**
   * This method get the enlistments of a event
   * @param data 
   */
  public getMyEnlistment(idAccount) {
    return this.http.get(this.url + '/my/' + idAccount, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    });
  }

  /**
   * This method delete a enlistment of some event
   * @param data 
   */
  public deleteEnlistment(idEnlistment) {
    return this.http.delete(this.url + idEnlistment, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    });
  }

}
