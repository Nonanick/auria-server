import { AuriaException } from "../AuriaException.js";


export class SystemUnavaliable extends AuriaException {

    public static CODE = "SYS.KERNEl.SYSTEM_UNAVALIABLE";

    getCode(): string {
        return SystemUnavaliable.CODE;
    }

    protected code: string;



    constructor(message: string) {
        super("[System] Resource not found!\n" + message);
    }
}