import { DateTime } from "ionic-angular";

export class Message {
  ownerId: number;
  id: number
  addressee: number;
  sendTime: Date | string;
  content: string;
  delivered: boolean;
}
