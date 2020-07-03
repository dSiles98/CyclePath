import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { IonicModule, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { AddNewBikePage } from './add-new-bike';
import { Geolocation as geolocation } from '@ionic-native/geolocation';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { IonicNativePlugin } from '@ionic-native/core';
import { By, DomSanitizer } from '@angular/platform-browser';
import { MyApp } from '../../app/app.component';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { BikesProvider } from '../../providers/bikes/bikes';
import { Camera } from '@ionic-native/camera';
import { NavParamsMock } from '../../mocks/nav-params.mock'
import { from } from 'rxjs/observable/from';
import { ComponentsModule } from '../../components/components.module';
import { FormBuilder } from '@angular/forms';
import { AuthenticationProvider } from '../../providers/authentication/authentication';

describe('Component: CreateAddNewBikePage', () => {
  let component: AddNewBikePage;
  let fixture: ComponentFixture<AddNewBikePage>;
  let param: Object = {title: 'ADDNEWBIKE'}
  NavParamsMock.setParams(param); 

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MyApp,
        AddNewBikePage
      ],
      imports: [
        IonicModule.forRoot(AddNewBikePage),
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
        Camera,
        FormBuilder,
        DomSanitizer,
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
    fixture = TestBed.createComponent(AddNewBikePage);
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

    it('should be title property equal ADDNEWBIKE', () => {
      expect(component.title).toEqual('ADDNEWBIKE');
    });

    it('should be firebaseRef property equal Bikes/', () => {
      expect(component.firebaseRef).toBe('Bikes/')
    });
  });

});
