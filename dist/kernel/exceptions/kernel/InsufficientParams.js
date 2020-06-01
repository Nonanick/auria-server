import { AuriaException } from "../AuriaException.js";
let InsufficientParams = /** @class */ (() => {
    class InsufficientParams extends AuriaException {
        constructor(message, requiredParams) {
            super(message, requiredParams);
        }
        getCode() {
            return InsufficientParams.InsufficientParamsCode;
        }
    }
    InsufficientParams.InsufficientParamsCode = "SYS.KERNEL.INSUFFICIENT_PARAMS";
    return InsufficientParams;
})();
export { InsufficientParams };
