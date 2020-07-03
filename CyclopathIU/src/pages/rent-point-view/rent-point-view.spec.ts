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
import { By, DomSanitizer } from '@angular/platform-browser';
import { MyApp } from '../../app/app.component';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { NavParamsMock } from '../../mocks/nav-params.mock'
import { from } from 'rxjs/observable/from';
import { ComponentsModule } from '../../components/components.module';
import { RentPointViewPage } from './rent-point-view';
import { BikesProvider } from '../../providers/bikes/bikes';
import { AuthenticationProvider } from '../../providers/authentication/authentication';


describe('Component: RentPointViewPage', () => {
  let component: RentPointViewPage;
  let fixture: ComponentFixture<RentPointViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MyApp,
        RentPointViewPage
      ],
      imports: [
        IonicModule.forRoot(RentPointViewPage),
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
    fixture = TestBed.createComponent(RentPointViewPage);
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

  describe('when the component has been created', () => {

    it('should return searchBarOn property false', () => {
      expect(component.searchBarOn).toBeFalsy();
    });
  });

});
