import { AuriaException } from "../AuriaException.js";


export class InsufficientParams extends AuriaException {

    public static InsufficientParamsCode: string = "SYS.KERNEL.INSUFFICIENT_PARAMS";

    constructor(message: string, requiredParams: string[]) {
        super(message, requiredParams);
    }
    
    getCode(): string {
        return InsufficientParams.InsufficientParamsCode;
    }


}