import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { IonicModule, NavParams } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { AllRoutesPage } from './all-routes';
import { RoutesProvider } from '../../providers/routes/routes';
import { Geolocation as geolocation } from '@ionic-native/geolocation';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { IonicNativePlugin } from '@ionic-native/core';
import { By } from '@angular/platform-browser';
import { MyApp } from '../../app/app.component';
import { NavParamsMock } from '../../mocks/nav-params.mock';
import { AuthenticationProvider } from '../../providers/authentication/authentication';

describe('Component: CreateAllRoutesPage', () => {
  let component: AllRoutesPage;
  let fixture: ComponentFixture<AllRoutesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MyApp,
        AllRoutesPage
      ],
      imports: [
        IonicModule.forRoot(AllRoutesPage),
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
        RoutesProvider,
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
    fixture = TestBed.createComponent(AllRoutesPage);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
    component = null;
  });

  it('should create', () => {
    spyOn(component, 'ionViewDidLoad');
    component.ionViewDidLoad();
    expect(component).toBeTruthy();
    expect(fixture).toBeTruthy();
    expect(component.ionViewDidLoad).toHaveBeenCalled();
  });

  describe('when the component has been created', () => {

    it('should return searchBarOn property false', () => {
      expect(component.searchBarOn).toBeFalsy();
    });

    it('should be searchTerm property empty', () => {
      expect(component.searchTerm).toBeUndefined()
    });
  });
      
});