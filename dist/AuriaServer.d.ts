import { Express } from 'express-serve-static-core';
import { System } from './kernel/System';
export declare type AuriaServerStatus = "online" | "offline" | "maintenance";
export declare const Auria_ENV: "development" | "production ";
export declare class AuriaServer {
    /**
     * App
     * ------
     *
     * Express server instance
     */
    private app;
    /**
     * Server public status
     * --------------------
     *
     * Online -> requests are handled normally
     * Offline -> requests are rejected
     * Maintenance -> only some features might work
     */
    serverStatus: AuriaServerStatus;
    /**
     * Port to be listened
     */
    /**
     * All system avaliable on this server
     */
    private systems;
    /**
     * This server session
     */
    private serverSessionId;
    /**
     * Function to be called each time a request by a client is made
     */
    private requestHandler;
    constructor(app: Express);
    private initializeExpressApp;
    /**
     * Add a System to this server
     *
     * @param system System to be added
     */
    addSystem(...system: System[]): AuriaServer;
    run(): AuriaServer;
}
