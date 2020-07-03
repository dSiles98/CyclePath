export interface IPatch {
    op: string;
    path: string;
    value: any;
}