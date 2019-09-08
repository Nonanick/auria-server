import { AuriaException } from "../AuriaException";
export declare class SystemUnavaliable extends AuriaException {
    static CODE: string;
    getCode(): string;
    protected code: string;
    constructor(message: string);
}
