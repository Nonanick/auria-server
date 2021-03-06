import { AuriaException } from "../AuriaException.js";
export declare class InsufficientParams extends AuriaException {
    static InsufficientParamsCode: string;
    constructor(message: string, requiredParams: string[]);
    getCode(): string;
}
