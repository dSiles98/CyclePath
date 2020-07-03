import { IShowRentPoint } from "../models/google-maps";
import { Subject, Observable } from "rxjs";

export class GoogleMapsProviderMock {
    private showRentPointSubject: Subject<IShowRentPoint> = new Subject<IShowRentPoint>();
    public showRentPointSubject$: Observable<IShowRentPoint> = this.showRentPointSubject.asObservable();
}