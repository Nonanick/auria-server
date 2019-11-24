import { Express, Request, Response, NextFunction } from 'express-serve-static-core';
import { AuriaCoreSystem } from './system/AuriaCore/AuriaCoreSystem';
import { System } from './kernel/System';
import { SystemRequest, SystemRequestFactory } from './kernel/http/request/SystemRequest';
import { SystemUnavaliable } from './kernel/exceptions/kernel/SystemUnavaliable';
import { Este } from './system/Este/Este';
import { RequestStack } from './kernel/RequestStack';

export type AuriaServerStatus = "online" | "offline" | "maintenance";

export const Auria_ENV: "development" | "production " = "development";


export class AuriaServer {

    /**
     * App
     * ------
     * 
     * Express server instance
     */
    private app: Express;

    /**
     * Server public status
     * --------------------
     * 
     * Online -> requests are handled normally
     * Offline -> requests are rejected
     * Maintenance -> only some features might work
     */
    public serverStatus: AuriaServerStatus = "online";

    /**
     * Port to be listened
     */
    //private port: number = 8080;

    /**
     * All system avaliable on this server
     */
    private systems: Map<string, System>;

    /**
     * This server session
     */
    private serverSessionId: number;


    /**
     * Function to be called each time a request by a client is made
     */
    private requestHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>
        = async (req, res, next) => {
            try {

                let stack : RequestStack = RequestStack.digestURL(req.url);

                if (!this.systems.has(stack.system())) {
                    throw new SystemUnavaliable("[SystemRequest] The requested system is not avaliable on this server!");
                }

                let system = this.systems.get(stack.system())!;

                let systemRequest: SystemRequest = SystemRequestFactory.make(req, system, stack);
                let systemResponse = system.handleRequest(systemRequest, res, next);
                
                console.log("System Response to request: ", systemResponse);
            }
            catch (ex) {
                
            }
        };


    constructor(app: Express) {

        console.log("\n[Auria Server] Initializing a new Auria server!");

        this.app = app;
        this.initializeExpressApp();

        this.systems = new Map();
        this.serverSessionId = Math.round(Math.random() * 10000000);

        
        console.log("[Auria Server] Initializing Systems...");
        this.addSystem(
            new AuriaCoreSystem(this),
            new Este(this)
        );
        console.log("[Auria Server] Server Instance Token: " + this.serverSessionId);

    }

    private initializeExpressApp() {

        var bodyParser = require('body-parser');
        var cookieParser = require('cookie-parser');

        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());

        //this.app.use(cors());
        this.app.disable("x-powered-by");
    }

    /**
     * Add a System to this server
     * 
     * @param system System to be added
     */
    public addSystem(...system: System[]): AuriaServer {
        system.forEach((sys) => {
            console.log("[Auria Server] Adding system: ", sys.name);
            this.systems.set(sys.name, sys);
        });

        return this;
    }

    public run(): AuriaServer {

        this.app.all(/.*/, this.requestHandler);

        //@todo implement https server creation!
        //this.app.listen(this.port);

        return this;
    }
}