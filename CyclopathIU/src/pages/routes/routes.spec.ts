import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { IonicModule, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { RoutesPage } from './routes';
import { RoutesProvider } from '../../providers/routes/routes';
import { Geolocation as geolocation } from '@ionic-native/geolocation';
import { GoogleMapNative } from '../../models/google-map';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { IonicNativePlugin } from '@ionic-native/core';
import { By } from '@angular/platform-browser';
import { MyApp } from '../../app/app.component';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { NavParamsMock } from '../../mocks/nav-params.mock';
import { AuthenticationProvider } from '../../providers/authentication/authentication';


describe('Component: CreateRoutePage', () => {
  let component: RoutesPage;
  let fixture: ComponentFixture<RoutesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MyApp,
        RoutesPage
      ],
      imports: [
        IonicModule.forRoot(RoutesPage),
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: NavParams, useClass: NavParamsMock },
        StatusBar,
        SplashScreen,
        TranslateService,
        HttpClient,
        HttpHandler,
        RoutesProvider,
        geolocation,
        AndroidPermissions,
        NavController,
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
    fixture = TestBed.createComponent(RoutesPage);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
    component = null;
  });

  it('should create', () => {
    spyOn(component, 'ionViewDidEnter');
    component.ionViewDidEnter();
    expect(component).toBeTruthy();
    expect(fixture).toBeTruthy();
    expect(component.ionViewDidEnter).toHaveBeenCalled();
  });

  describe('when the component has been created', () => {

    it('should return searchBarOn property false', () => {
      expect(component.searchBarOn).toBeFalsy();
    });

    it('should be searchTerm property empty', () => {
      expect(component.searchTerm).toBe('')
    });

    it('should be routesList property empty', () => {
      expect(component.routesList.length).toBe(0);
    });

    it('should be items property empty', () => {
      expect(component.items.length).toBe(0)
    });
  });

});
