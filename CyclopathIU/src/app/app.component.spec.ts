import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { IonicModule } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MyApp } from './app.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { SingletonProvider } from '../providers/singleton/singleton';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ConfigProvider } from '../providers/config/config';
import { UsersProvider } from '../providers/users/users';
import { FriendsProvider } from '../providers/friends/friends';
import { RoutesProvider } from '../providers/routes/routes';
import { MessagesProvider } from '../providers/messages/messages';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { HomePage } from '../pages/home/home';
import { RentPointsPage } from '../pages/rent-points/rent-points';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { SessionsHandlerProvider } from '../providers/sessions-handler/sessions-handler';
import { AuthenticationProvider } from '../providers/authentication/authentication';


describe('CreateAppComponent', () => {
  let component: MyApp;
  let fixture: ComponentFixture<MyApp>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MyApp
      ],
      imports: [
        IonicModule.forRoot(MyApp), 
        TranslateModule.forRoot()
      ],
      providers: [
        StatusBar,
        SplashScreen,
        TranslateService,
        SingletonProvider,
        ConfigProvider,
        UsersProvider,
        FriendsProvider,
        RoutesProvider,
        MessagesProvider,
        LocalNotifications,
        HttpClient,
        HttpHandler,
        SessionsHandlerProvider,
        AuthenticationProvider
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyApp);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'Cycle Path'`, async(() => {
    expect(component.title).toEqual('Cycle Path');
  }));

  it(`shouldn't be logged`, async(() => {
    expect(component.logged()).toBeNull();
  }));

  it(`should be HomePage Component`, async(() => {
    expect(component.rootPage).toEqual(HomePage);
  }));

  it(`should be null name of User`, async(() => {
    expect(component.name).toBeNull();
  }));

  it(`should be null username of User`, async(() => {
    expect(component.username).toBeNull();
  }));

  it(`should be null last name of User`, async(() => {
    expect(component.lastname).toBeNull();
  }));

  it(`should be false data of User`, async(() => {
    expect(component.data).toBeFalsy();
  }));

  it(`should be empty local storage`, async(() => {
    expect(localStorage.length).toEqual(0);
  }));
});