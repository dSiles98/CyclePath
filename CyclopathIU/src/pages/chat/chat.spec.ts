import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { IonicModule, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { RoutesProvider } from '../../providers/routes/routes';
import { Geolocation as geolocation } from '@ionic-native/geolocation';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { MyApp } from '../../app/app.component';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { NavParamsMock } from '../../mocks/nav-params.mock';
import { ChatPage } from './chat';
import { FriendsProvider } from '../../providers/friends/friends';
import { UsersProvider } from '../../providers/users/users';
import { MessagesProvider } from '../../providers/messages/messages';
import { BlocksProvider } from '../../providers/blocks/blocks';
import { AuthenticationProvider } from '../../providers/authentication/authentication';


describe('Component: CreateChatPage', () => {
  let component: ChatPage;
  let fixture: ComponentFixture<ChatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MyApp,
        ChatPage
      ],
      imports: [
        IonicModule.forRoot(ChatPage),
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
        FriendsProvider,
        UsersProvider,
        MessagesProvider,
        BlocksProvider,
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
    fixture = TestBed.createComponent(ChatPage);
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

    it('should return isBlocked property false', () => {
      expect(component.isBlocked).toBeFalsy();
    });

    it('should be isFriend property empty', () => {
      expect(component.isFriend).toBeTruthy();
    });
  });

});
