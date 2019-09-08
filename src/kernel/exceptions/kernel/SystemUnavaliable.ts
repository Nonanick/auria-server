import { AuriaException } from "../AuriaException";

export class SystemUnavaliable extends AuriaException {

    public static CODE = "100001";

    getCode(): string {
        return SystemUnavaliable.CODE;
    }

    protected code: string;



    constructor(message: string) {
        super("[System] Resource not found!\n" + message);
    }
}