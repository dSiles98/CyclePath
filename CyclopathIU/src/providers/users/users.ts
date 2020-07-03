import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { AppConfigurations } from '../../assets/configuration';
import { Subscription } from 'rxjs';
import { AuthenticationProvider } from '../authentication/authentication';



@Injectable()
export class UsersProvider {
  public url: string;
  public token: string;
  private tokenSubscription: Subscription = null;

  /**
   * Constructor
   * @param http 
   */
  constructor(public http: HttpClient, public authProvider: AuthenticationProvider) {
    this.url = new AppConfigurations().url + 'api/account';
    this.token = localStorage.getItem('token');
    this.tokenSubscription = this.authProvider.tokenSubject$.subscribe((token: string) => {
      this.token = token;
    });
  }

  /**
   * delete an user.
   * @param data 
   */
  public deleteUser(username:string, password:string) {
    localStorage.removeItem('user');
    let info = "Basic " + btoa(username + ':' + password);
    return this.http.delete(this.url + '/' + username,
      {
        headers: new HttpHeaders({
          'Authorization': info
        })
      });
  }

  /**
   * This method post  a new user
   * @param data 
   */
  public postUser(data: any) {
    return this.http.post(this.url, data, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    });
  }
  
  /**
   *get all the users from the server
   */
  public getUsers() {
    return this.http.get(this.url, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    });
  }

  /**
   * This method get a user
   * @param id 
   */
  public getUser(id: string) {
    return this.http.get(this.url + '/' + id, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    });
  }


  /**
   * This method get a user by id
   * @param id 
   */
  public getUserById(id: number) {
    return this.http.get(this.url + '/id/' + id, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    });
  }

  /**
   * This method edit a user
   * @param data 
   * @param id 
   */
  public putUsers(data: any, id: string) {
    return this.http.put(this.url + '/' + id, data,{
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    });
  }

  public patchAccount(id: any, data: any) {
    console.log(data);
    return this.http.patch(this.url + '/' + id, data,{
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    });
  }

  /**
   * This method recover the password of a user
   * @param username 
   */
  public recoverPassword(username: string)
  {
    return this.http.get(this.url + '/recoverpassword/' + username)
  }

  public changePassword(username: string, data: any)
  {
    return this.http.put(this.url + '/' + username +'/password', data, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.token
      })
    });
  }
}
