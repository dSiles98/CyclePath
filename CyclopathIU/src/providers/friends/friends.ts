import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { FriendShip } from '../../models/FriendShip';
import { AppConfigurations } from '../../assets/configuration';
import { Subscription } from 'rxjs';
import { AuthenticationProvider } from '../authentication/authentication';


@Injectable()
export class FriendsProvider {
  public url: string;
  public token: string;
  private tokenSubscription: Subscription = null;
  /**
   *  Constructor 
   * @param http 
   */
  constructor(public http: HttpClient, public authProvider: AuthenticationProvider) {
    this.url = new AppConfigurations().url + 'api/friendslist';
    this.token = localStorage.getItem('token');
    this.tokenSubscription = this.authProvider.tokenSubject$.subscribe((token: string) => {
      this.token = token;
    });
  }

  /**
   * This method post a new frindship
   * @param data 
   */
  public postFriendShip(data: FriendShip) {
    return this.http.post(this.url, data, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    });
  }

  /**
   * This method delete a new frindship
   * @param data 
   */
  public deleteFriendShip(id: number) {
    return this.http.delete(this.url + "/" + id, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    });
  }

  /**
   *get all the users from the server
   */
  public getFriends(account: string) {
    return this.http.get(this.url + "/" + account, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    });
  }
}
