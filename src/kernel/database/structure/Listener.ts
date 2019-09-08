import { KernelEntity } from "./KernelEntity";

export class Listener extends KernelEntity {
    
    public asJSON(): { [prop: string]: any; } {
        throw new Error("Method not implemented.");
    }
    
}