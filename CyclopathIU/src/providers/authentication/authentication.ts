import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigurations } from '../../assets/configuration';
import { Subject, Observable } from 'rxjs';


@Injectable()
export class AuthenticationProvider {
  public url: string;
  private tokenSubject: Subject<string> = new Subject<string>();
  public tokenSubject$: Observable<string> = this.tokenSubject.asObservable();
  constructor(public http: HttpClient) {
    this.url = new AppConfigurations().url + 'api/auth/token';
  }

  set Tokken(token: string) {
    this.tokenSubject.next(token);
  }
  
  /**
   * return the promise of get a authentication token from the server
   * @param data 
   */
  login(data: any) {
    localStorage.removeItem('user');
    let info = "Basic " + btoa(data.get('username').value + ':' + data.get('password').value);
    return this.http.get(this.url,
      {
        headers: new HttpHeaders({
          'Authorization': info
        })
      });
    }

  /**
   * delete the authentication token from the app
   */
  logout() {
    localStorage.removeItem('user');
    window.location.reload();
  }
}
