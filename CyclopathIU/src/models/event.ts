export class Event {
    id: number;
    ownerId: number;
    name: string;
    latitude: number;
    longitude: number; 
    routeId: number; 
    eventDate: string;
}

export interface IEvent {
    id: number;
    ownerId: number;
    name: string;
    latitude: number;
    longitude: number; 
    routeId: number; 
    eventDate: string;
}

export interface IEnlistment {
    id: number;
    idAccount: number;
    idEvent: number;
}