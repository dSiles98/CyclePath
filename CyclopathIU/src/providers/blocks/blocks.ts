import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { AppConfigurations } from '../../assets/configuration';
import { AuthenticationProvider } from '../authentication/authentication';
import { Subscription } from 'rxjs';

@Injectable()
export class BlocksProvider {
  public url: string;
  public token: string;
  private tokenSubscription: Subscription = null;

  constructor(public http: HttpClient, public authProvider: AuthenticationProvider) {
    this.url = new AppConfigurations().url + 'api/Blocks/';
    this.token = localStorage.getItem('token');
    this.tokenSubscription = this.authProvider.tokenSubject$.subscribe((token: string) => {
      this.token = token;
    });
  }

  /**
   * This method post a new block user
   * @param data 
   */
  public postBlock(data) {
    return this.http.post(this.url, data, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    });
  }

  /**
   * This method get the list of blocks
   * @param data 
   */
  public getBlocks(idUser) {
    return this.http.get(this.url + idUser, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    });
  }

  /**
   * This method unblock someone.
   * @param data 
   */
  public deleteBlock(id) {
    return this.http.delete(this.url + id, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    });
  }

}
