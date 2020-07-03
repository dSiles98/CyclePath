import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Conversation } from '../../models/conversation';

/*
  Generated class for the SingletonProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SingletonProvider {
  private data: Array<Conversation>;
  constructor(public http: HttpClient) {
    console.log('Hello SingletonProvider Provider');
  }

  public getData():Array<Conversation> {
    return this.data;
  }

  public setData(newData) {
    this.data = newData;
  }
}
