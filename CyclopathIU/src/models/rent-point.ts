/**
 * model of rentpoint
 */
export class RentPoint {
    id: number;
    ownerId: number;
    title: string;
    rating: number;
    latitude: number;
    longitude: number; 
    direction: string;
    country: string;
    city: string;
}

export interface IRentPoint {
  id: number;
  ownerId: number;
  title: string;
  rating: number;
  latitude: number;
  longitude: number;
  direction: string;
  country: string;
  city: string;
}
