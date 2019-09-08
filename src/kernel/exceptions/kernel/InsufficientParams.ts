import { AuriaException } from "../AuriaException";

export class InsufficientParams extends AuriaException {

    public static InsufficientParamsCode: string = "AE_INS_PARAM";

    constructor(message: string, requiredParams: string[]) {
        super(message, requiredParams);
    }
    
    getCode(): string {
        return InsufficientParams.InsufficientParamsCode;
    }


}