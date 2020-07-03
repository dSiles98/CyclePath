import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { AppConfigurations } from '../../assets/configuration';
import { IRoute } from '../../models/route';
import { AuthenticationProvider } from '../authentication/authentication';
import { Subscription } from 'rxjs';


@Injectable()
export class RoutesProvider {
  public url: string;
  public token: string;
  private tokenSubscription: Subscription = null;

  /**
   * Constructor
   * @param http 
   */
  constructor(public http: HttpClient, public authProvider: AuthenticationProvider) {
    this.url = new AppConfigurations().url + 'api/route';
    this.token = localStorage.getItem('token');
    this.tokenSubscription = this.authProvider.tokenSubject$.subscribe((token: string) => {
      this.token = token;
    });
  }

  /**
   * This method create a new route.
   * @param data
   */
  public postRoute(data: IRoute) {
    return this.http.post(this.url, data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    });
  }

  /**
   * This method get all the routes
   */
  public getRoutes(data: string = '', city: string = '') {
    return this.http.get(`${this.url}?category=${data}&city=${city}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    });
  }

/**
   * This method get all the routes of a user
   */
  public getFilteredRoutesOf( user: string = '', data: string = '', city: string = '',) {
    return this.http.get(`${this.url}?category=${data}&city=${city}&user=${user}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    })
  }


  /**
   * This method get the routes of a user
   */
  public getRoutesOf(user: string) {
    return this.http.get(`${this.url}/owner/${user}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    });
  }


  /**
   * This method delete a route
   * @param id 
   */
  public deleteRoute(id: number) {
    return this.http.delete(`${this.url}/${id}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    });
  }

  /**
   * This method get a route
   * @param id 
   */
  public getRoute(id: number) {
    return this.http.get(`${this.url}/${id}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    });
  }

  /**
   * This method edit a route
   * @param id 
   * @param data 
   */
  public editRoute(id: number, data: IRoute) {
    return this.http.put(`${this.url}/${id}`, data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    });
  }
}
