import { Geolocation } from "@ionic-native/geolocation";

export class GeolocationMock extends Geolocation {
  latitude = 1;
  longitude = 1;

  getCurrentPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve({
        coords: {
          latitude: this.latitude,
          longitude: this.longitude
        }
      });
    });
  }

  setLatitude(latitude: number) {
    this.latitude = latitude;
  }

  setLongitude(longitude: number) {
    this.longitude = longitude;
  }
}