export interface IBike {
    id?: number;
    rentPointId: number;
    description: string;
    price: number;
    disponible: boolean;
    image: string;
}


export class Bike implements IBike {
    public id: number;
    public rentPointId: number;
    public description: string;
    public price: number;
    public disponible: boolean;
    public image: string;
}
