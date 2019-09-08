import { KernelEntity } from "./KernelEntity";
export declare class Module extends KernelEntity {
    asJSON(): {
        [prop: string]: any;
    };
    name: string;
    protected title: string;
    protected description: string;
    color: string;
    icon: string;
    protected active: boolean;
    protected createdAt: Date;
    protected updatedAt: Date;
}
