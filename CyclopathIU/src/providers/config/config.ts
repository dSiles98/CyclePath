import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/Rx';


@Injectable()
export class ConfigProvider {
  private theme: BehaviorSubject<string>;
  private language: BehaviorSubject<string>;
  constructor(public http: HttpClient) {
    this.theme = new BehaviorSubject(localStorage.getItem('theme'));
    this.language = new BehaviorSubject(localStorage.getItem('language'));
  }

  setActiveTheme(value) {
    this.theme.next(value);
  }

  getActiveTheme() {
    return this.theme.asObservable();
  }

  getActiveLanguage() {
    return this.language.asObservable();
  }

  setActiveLanguage(value) {
    this.language.next(value);
  }
}