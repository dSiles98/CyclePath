import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule} from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule, HttpClient} from '@angular/common/http';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SignupPage } from '../pages/signup/signup';
import { UsersProvider } from '../providers/users/users';
import { LoginPage } from '../pages/login/login';
import { RecoverPasswordPage } from '../pages/recover-password/recover-password';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { CreateRentPointPageModule } from '../pages/create-rent-point/create-rent-point.module';
import { ImagePicker } from '@ionic-native/image-picker';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps } from '@ionic-native/google-maps';
import { RentPointProvider } from '../providers/rent-point/rent-point';
import { ComponentsModule } from '../components/components.module';
import { CreateRoutesPageModule } from '../pages/create-routes/create-routes.module';
import { MyRentPointsPageModule } from '../pages/my-rent-points/my-rent-points.module';
import { RentPointsPageModule } from '../pages/rent-points/rent-points.module';
import { AddNewBikePageModule } from '../pages/add-new-bike/add-new-bike.module';
import { EditAccountPageModule } from '../pages/edit-account/edit-account.module';
import { FriendsProvider } from '../providers/friends/friends';
import { BikesProvider } from '../providers/bikes/bikes';
import { AccountPageModule } from '../pages/account/account.module';
import { AccountsPageModule } from '../pages/accounts/accounts.module';
import { ModifyRentsPageModule } from '../pages/modify-rents/modify-rents.module';
import { MyFriendsPageModule } from '../pages/my-friends/my-friends.module';
import { RentPointViewPageModule } from '../pages/rent-point-view/rent-point-view.module';
import { RoutesProvider } from '../providers/routes/routes';
import { RoutesPageModule } from '../pages/routes/routes.module';
import { EditRoutePageModule } from '../pages/edit-route/edit-route.module';
import { RentPointPageModule } from '../pages/rent-point/rent-point.module';
import { AllRoutesPageModule } from '../pages/all-routes/all-routes.module';
import { ChatPageModule } from '../pages/chat/chat.module';
import { MessagesProvider } from '../providers/messages/messages';
import { RoutePageModule } from '../pages/route/route.module';
import { Camera } from '@ionic-native/camera';
import { CreateEventPageModule } from '../pages/create-event/create-event.module';
import { EventProvider } from '../providers/event/event';
import { MyEventsPageModule } from '../pages/my-events/my-events.module';
import { EditEventPageModule } from '../pages/edit-event/edit-event.module';
import { EventsPageModule } from '../pages/events/events.module';
import { EventPageModule } from '../pages/event/event.module';
import { MyEnlistmentsPageModule } from '../pages/my-enlistments/my-enlistments.module';
import { ConversationsPageModule } from '../pages/conversations/conversations.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateService } from '@ngx-translate/core';
import { SingletonProvider } from '../providers/singleton/singleton';
import { ChangePasswordPageModule } from '../pages/change-password/change-password.module';
import { AppConfigurationPageModule } from '../pages/app-configuration/app-configuration.module';
import { ConfigProvider } from '../providers/config/config';
import { BlocksProvider } from '../providers/blocks/blocks';
import { BlocksPageModule } from '../pages/blocks/blocks.module';
import { EnlistmentsProvider } from '../providers/enlistments/enlistments';
import { AndroidPermissions } from '@ionic-native/android-permissions';

import { LocalNotifications } from '@ionic-native/local-notifications';
import { SessionsHandlerProvider } from '../providers/sessions-handler/sessions-handler';
import { GoogleMapsProvider } from '../providers/google-maps/google-maps';
import { MapAllRoutesPageModule } from '../pages/map-all-routes/map-all-routes.module';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SignupPage,
    LoginPage,
    RecoverPasswordPage,
  ],
  imports: [
    MyEnlistmentsPageModule,
    BlocksPageModule,
    HttpClientModule, 
    BrowserModule,
    AccountPageModule,
    ConversationsPageModule,
    ChatPageModule,
    AccountsPageModule,
    ComponentsModule,
    CreateRoutesPageModule,
    MyRentPointsPageModule,
    MyFriendsPageModule,
    ModifyRentsPageModule,
    AddNewBikePageModule,
    RentPointsPageModule,
    RentPointViewPageModule,
    EditAccountPageModule,
    HttpClientModule,
    BrowserModule,
    CreateRentPointPageModule,
    ChangePasswordPageModule,
    RoutesPageModule,
    EditRoutePageModule,
    RentPointPageModule,
    AllRoutesPageModule,
    MapAllRoutesPageModule,
    RoutePageModule,
    CreateEventPageModule,
    MyEventsPageModule,
    EditEventPageModule,
    EventsPageModule,
    EventPageModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AppConfigurationPageModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SignupPage,
    LoginPage,
    RecoverPasswordPage,
  ],
  providers: [
    ConfigProvider,
    LocalNotifications,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UsersProvider,
    GoogleMaps,
    ImagePicker,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthenticationProvider,
    RentPointProvider,
    FriendsProvider,
    BikesProvider,
    RoutesProvider,
    MessagesProvider,
    Camera,
    EventProvider,
    TranslateService,
    SingletonProvider,
    BlocksProvider,
    EnlistmentsProvider,
    AndroidPermissions,
    SessionsHandlerProvider,
    GoogleMapsProvider
  ],
  schemas: [
  ]
})
export class AppModule {}
