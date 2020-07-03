import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { AppConfigurations } from '../../assets/configuration';
import { Subscription } from 'rxjs';
import { AuthenticationProvider } from '../authentication/authentication';

@Injectable()
export class MessagesProvider {
  public url: string;
  public token: string;
  private tokenSubscription: Subscription = null;

  /**
   * Constructor 
   * @param http 
   */
  constructor(public http: HttpClient, public authProvider: AuthenticationProvider) {
    this.url = new AppConfigurations().url+'api/messages';
    this.token = localStorage.getItem('token');
    this.tokenSubscription = this.authProvider.tokenSubject$.subscribe((token: string) => {
      this.token = token;
    });
  }

  /**
   * send a message
   * @param data 
   */
  sendMessage(data: any) {
    return this.http.post(this.url, data, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    });
  }

  /**
   * get the messages of a conversation
   * @param data 
   */
  getMessages(from: number, to: number) {
    return this.http.get(this.url+"/"+from+"/to/"+to, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    });
  }

  /**
   * update the info of delivered of a message
   * @param id
   */
  setMessageDelivered(id: number, data: any) {
    return this.http.put(this.url + "/" + id, data,
      {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + this.token
        })
      });
  }

  /**
   * get the conversations of the user and the state.
   * @param id
   */
  getConversationsStatus(id: number) {
    return this.http.get(this.url + "/" + id,
      {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + this.token
        })
      });
  }

}
