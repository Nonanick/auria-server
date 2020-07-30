import { Express } from 'express-serve-static-core';
import { System } from './kernel/System.js';
import { AuriaServerBootInfo } from './server/AuriaServerBootInfo.js';
import { BootSequence } from 'aurialib2';
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
    private serverInstanceId;
    protected auriaBootInfo: AuriaServerBootInfo;
    protected boot: BootSequence;
    /**
     * [HTTP Request Entry Point]
     * Request Handler
     * ---------------
     * Function to be called each time an HTTP request is made
     * will try to forward the request to the system responsible
     * for handling it;
     *
     */
    private requestHandler;
    private sendSystemResponse;
    private answerServerStatus;
    private handleRequestException;
    constructor(app: Express);
    /**
     * Load Express modules
     * --------------------
     * Common to ALL SYSTEMS under this server!
     * > BodyParser: URL Encoded + JSON
     * > CookieParser
     * > Disable X-Powered-By Header (security trough obscurity?)
     * > CORS (?)
     */
    private initializeExpressApp;
    /**
     * Add a System to this server
     *
     * @param system System to be added
     */
    addSystem(...system: System[]): AuriaServer;
    run(): AuriaServer;
}
