import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { MyApp } from '../../app/app.component';
import { GoogleMapsComponent } from './google-maps';
import { IonicModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { Geolocation } from '@ionic-native/geolocation';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';
import { GoogleMapsProviderMock } from '../../mocks/google-maps-provider.mock';
import { GeolocationMock } from '../../mocks/geolocation.mock';

describe('Component: GoogleMapsComponent', () => {
    let component: GoogleMapsComponent;
    let fixture: ComponentFixture<GoogleMapsComponent>;
  
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [
          MyApp,
          GoogleMapsComponent
        ],
        imports: [
          IonicModule.forRoot(GoogleMapsComponent),
          TranslateModule.forRoot()
        ],
        providers: [
          { provide: GoogleMapsProvider, useClass: GoogleMapsProviderMock },
          { provide: Geolocation, useClass: GeolocationMock }
        ],
        schemas: [
          CUSTOM_ELEMENTS_SCHEMA,
          NO_ERRORS_SCHEMA
        ]
      })
        .compileComponents();
    }));
  
    beforeEach(() => {
      fixture = TestBed.createComponent(GoogleMapsComponent);
      component = fixture.componentInstance;
      component.ngOnInit();
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