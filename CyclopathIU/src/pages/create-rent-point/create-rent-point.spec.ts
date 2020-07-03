import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { IonicModule, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { RoutesProvider } from '../../providers/routes/routes';
import { Geolocation as geolocation, Geolocation } from '@ionic-native/geolocation';
import { GoogleMapNative } from '../../models/google-map';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { IonicNativePlugin } from '@ionic-native/core';
import { By } from '@angular/platform-browser';
import { MyApp } from '../../app/app.component';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { NavParamsMock } from '../../mocks/nav-params.mock';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';
import { GoogleMapsProviderMock } from '../../mocks/google-maps-provider.mock';
import { GeolocationMock } from '../../mocks/geolocation.mock';
import { CreateRentPointPage } from './create-rent-point';
import { EventProvider } from '../../providers/event/event';
import { RentPointProvider } from '../../providers/rent-point/rent-point';
import { ImagePicker } from '@ionic-native/image-picker';
import { AuthenticationProvider } from '../../providers/authentication/authentication';


describe('Component: CreateRentPointPage', () => {
  let component: CreateRentPointPage;
  let fixture: ComponentFixture<CreateRentPointPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MyApp,
        CreateRentPointPage
      ],
      imports: [
        IonicModule.forRoot(CreateRentPointPage),
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: NavParams, useClass: NavParamsMock },
        { provide: GoogleMapsProvider, useClass: GoogleMapsProviderMock },
        { provide: Geolocation, useClass: GeolocationMock },
        StatusBar,
        SplashScreen,
        TranslateService,
        HttpClient,
        HttpHandler,
        RoutesProvider,
        geolocation,
        AndroidPermissions,
        NavController,
        EventProvider,
        RentPointProvider,
        ImagePicker,
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
    fixture = TestBed.createComponent(CreateRentPointPage);
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
