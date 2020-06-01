import { AuriaException } from "../AuriaException.js";
export declare class SystemUnavaliable extends AuriaException {
    static CODE: string;
    getCode(): string;
    protected code: string;
    constructor(message: string);
}
