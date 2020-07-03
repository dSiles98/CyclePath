import { ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMap, GoogleMapOptions } from '@ionic-native/google-maps';
import { AndroidPermissions } from '@ionic-native/android-permissions';

declare var google: any;

export class GoogleMapNative {
  protected map: GoogleMap;
  protected actual: GoogleMap;
  protected mapReference: ElementRef;

  constructor(protected geolocation: Geolocation, protected androidPermissions: AndroidPermissions) {
    this.mapReference = null;
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => result.hasPermission,
      (err) => {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION);
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
      });
  }

  /**
   * This method Allow know the current Location.
   * @param mapRef
   */
  protected async getGeoposition(mapRef) {
    this.mapReference = mapRef;
    await this.geolocation.getCurrentPosition().then((position) => {
      this.showMap(position);
    });
    return this.map;
  }

  /**
   * This method load the map and mark the current position
   * @param position
   */
  protected showMap(position) {
    const location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    const options: GoogleMapOptions = {
      center: location,
      zoom: 15
    };
    this.map = new google.maps.Map(this.mapReference.nativeElement, options);
    google.maps.event.addListener(this.map, 'click', (event) => {
      this.marker(event, this.map);
    });
    this.AddMarker(location, this.map);
  }

  /**
   * This method mark a position.
   * @param position
   * @param map
   */
  protected AddMarker(position, map) {
    return new google.maps.Marker({ position, map })
  }

  /**
   * This method mark pin on the map.
   * @param event
   * @param map
   */
  protected marker(event, map) { }

  /**
   * This method get information about current location.
   */
  public getInformationCountry(latitude, longitude) : Promise<{}> {
    var location = {country: '', city: ''};
    var aux = [];
    let geocorde = new google.maps.Geocoder();
    var latlng = { lat: latitude, lng:  longitude};
    return new Promise((resolve, reject) => {
      geocorde.geocode({ 'location': latlng }, function (results, status) {
        if (status == 'OK') {
          if (results[0]) {
            var add= results[0].formatted_address ;
            var  value=add.split(",");
            let count=value.length;
            location.country=value[count-1];
            location.city=value[count-2];
            return resolve(location);
          }
          else  {
            alert("address not found");
          }
        }
        else {
          alert('Geocoder was not successful for the following reason: ' + status);
        }
          });
        });
  }

}
