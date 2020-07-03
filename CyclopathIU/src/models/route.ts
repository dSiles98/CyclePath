export interface IRoute {
  id?: number;
  category: string;
  owner: string;
  country: string;
  city: string;
  address: string;
  date: string;
  checkpoints: Array<ICheckpoint>;
}


export class Route implements IRoute {
  public id: number;
  public category: string;
  public owner: string;
  public country: string;
  public city: string;
  public address: string;
  public date: string;
  public checkpoints: Array<ICheckpoint>;

  public Route() {
    this.category = "";
    this.owner = "";
    this.checkpoints = [];
  }

}

export interface ICheckpoint {
  latitude: number;
  length: number;
}

export class Checkpoint implements ICheckpoint {
  public latitude: number;
  public length: number;
}
