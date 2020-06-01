
import { EventEmitter } from "events";
import { AuriaResponse } from "./AuriaResponse.js";
import { SystemUser } from "../security/user/SystemUser.js";

export class AuriaEventResponse extends EventEmitter {

    protected response: AuriaResponse;
    /**
     * User
     * -----
     * 
     */
    protected user: SystemUser;

    constructor(response: AuriaResponse, user: SystemUser) {
        super();
        this.user = user;
        this.response = response;

        this.response.getRawResponse().status(200).set({
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });
    }

    public getUser(): SystemUser {
        return this.user;
    }

    closeConnection() {
        this.response.getRawResponse().emit('close');
    }

    public sendData(event: string, data: any, id?: string) {

        let parsed = JSON.stringify(data);

        let pieces = parsed.replace("\n\n", "\n \n").split("\n");
        let piecesFixed = pieces.map((val) => { return "data: " + val });

        let str = piecesFixed.join("\n");

        this.response.getRawResponse().write(
            (id == null ? "" : "id: " + id + "\n") +
            "event: " + event + "\n"
            + str
            + "\n\n"
        );
    }

}