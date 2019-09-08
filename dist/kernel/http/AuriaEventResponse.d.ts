/// <reference types="node" />
import { AuriaResponse } from "./AuriaResponse";
import { EventEmitter } from "events";
import { SystemUser } from "../security/SystemUser";
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
