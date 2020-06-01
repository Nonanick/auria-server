import { AuriaException } from "../AuriaException.js";
let SystemUnavaliable = /** @class */ (() => {
    class SystemUnavaliable extends AuriaException {
        constructor(message) {
            super("[System] Resource not found!\n" + message);
        }
        getCode() {
            return SystemUnavaliable.CODE;
        }
    }
    SystemUnavaliable.CODE = "SYS.KERNEl.SYSTEM_UNAVALIABLE";
    return SystemUnavaliable;
})();
export { SystemUnavaliable };
