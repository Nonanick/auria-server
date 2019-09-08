import { KernelEntity } from "./KernelEntity";

export class Module extends KernelEntity {
    
    public asJSON(): { [prop: string]: any; } {
        throw new Error("Method not implemented.");
    }
    
    public name : string;

    protected title : string;

    protected description : string;

    public color : string;

    public icon : string;

    protected active : boolean;

    protected createdAt : Date;

    protected updatedAt : Date;
    
}