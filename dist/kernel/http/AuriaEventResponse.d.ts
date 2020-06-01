/// <reference types="node" />
import { EventEmitter } from "events";
import { AuriaResponse } from "./AuriaResponse.js";
import { SystemUser } from "../security/user/SystemUser.js";
export declare class AuriaEventResponse extends EventEmitter {
    protected response: AuriaResponse;
    /**
     * User
     * -----
     *
     */
    protected user: SystemUser;
    constructor(response: AuriaResponse, user: SystemUser);
    getUser(): SystemUser;
    closeConnection(): void;
    sendData(event: string, data: any, id?: string): void;
}
