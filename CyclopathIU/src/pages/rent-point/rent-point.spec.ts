import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { IonicModule, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { Geolocation as geolocation } from '@ionic-native/geolocation';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { IonicNativePlugin } from '@ionic-native/core';
import { By } from '@angular/platform-browser';
import { MyApp } from '../../app/app.component';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { BikesProvider } from '../../providers/bikes/bikes';
import { RentPointProvider } from '../../providers/rent-point/rent-point';
import { UsersProvider } from '../../providers/users/users';
import { NavParamsMock } from '../../mocks/nav-params.mock';
import { ComponentsModule } from '../../components/components.module';
import { RentPointPage } from './rent-point';
import { AuthenticationProvider } from '../../providers/authentication/authentication';

describe('Component: RentPointPage', () => {
  let component: RentPointPage;
  let fixture: ComponentFixture<RentPointPage>;
  

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MyApp,
        RentPointPage
      ],
      imports: [
        IonicModule.forRoot(RentPointPage),
        TranslateModule.forRoot(),
        ComponentsModule
      ],
      providers: [
        { provide: NavParams, useClass: NavParamsMock },
        StatusBar,
        SplashScreen,
        TranslateService,
        HttpClient,
        HttpHandler,
        geolocation,
        AndroidPermissions,
        NavController,
        BikesProvider,
        RentPointProvider,
        UsersProvider,
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
    fixture = TestBed.createComponent(RentPointPage);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
    component = null;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toBeTruthy();
  });

});
