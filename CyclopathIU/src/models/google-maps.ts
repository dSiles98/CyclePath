import { IRentPoint } from "./rent-point";

export interface ILocality {
  city: string;
  state: string;
  country: string;
  street?: string;
  zipcode?: string;
}

export interface IShowRentPoint {
  rentPoint: IRentPoint;
  editable: boolean;
}