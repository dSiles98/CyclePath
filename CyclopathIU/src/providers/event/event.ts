import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { AppConfigurations } from '../../assets/configuration';
import { Subscription } from 'rxjs';
import { AuthenticationProvider } from '../authentication/authentication';

@Injectable()
export class EventProvider {

  public url: string;
  public token: string;
  private tokenSubscription: Subscription = null;
  constructor(public http: HttpClient, public authProvider: AuthenticationProvider) {
    this.url = new AppConfigurations().url + 'api/Event';
    this.token = localStorage.getItem('token');
    this.tokenSubscription = this.authProvider.tokenSubject$.subscribe((token: string) => {
      this.token = token;
    });
  }

  /**
   * This method gets all the Events
   */
  public getEvents() {
    return this.http.get(this.url, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    });
  }

  /**
   * This method post a new Event
   * @param data 
   */
  public postEvent(data: any) {
    return this.http.post(this.url, data, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    });
  }

  /**
   * This method gets my Events
   * @param ownerId Id to search route
   */
  public getMyOwnEvents(ownerId: number) {
    return this.http.get(this.url+'?ownerid=' + ownerId, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    });
  }

  /**
   * This method updates de Event
   * @param data new event
   * @param id event
   */
  public putEvent(data: any, id: number) {
    return this.http.put(this.url + '/' + id, data, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    });
  }

  /**
   * This method gets the Event information
   * @param id event id
   */
  public getEventInfo(id: number) {
    return this.http.get(this.url + '/' + id, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    });
  }

  /**
   * This method Deletes the event
   * @param id event id
   */
  public deleteEvent (id: number) {
    return this.http.delete(this.url + '/' + id, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    });
  }


}
