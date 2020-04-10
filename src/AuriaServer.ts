import { Express, Request, Response, NextFunction } from 'express-serve-static-core';
import { System } from './kernel/System';
import { SystemRequest } from './kernel/http/request/SystemRequest';
import { SystemUnavaliable } from './kernel/exceptions/kernel/SystemUnavaliable';
import { RequestStack } from './kernel/RequestStack';
import { ServerRequest, ServerRequestFactory } from './kernel/http/request/ServerRequest';
import { AuriaException } from './kernel/exceptions/AuriaException';
import { AuriaServerBootInfo } from './server/AuriaServerBootInfo';
import { AuriaSystem } from './default/AuriaSystem';
import { ServerResponse } from 'aurialib2';

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
    private serverInstanceId: number;

    protected auriaBootInfo: AuriaServerBootInfo;


    /**
     * [HTTP Request Entry Point]
     * Request Handler
     * ---------------
     * Function to be called each time an HTTP request is made
     * will try to forward the request to the system responsible
     * for handling it;
     * 
     */
    private requestHandler: (req: Request, res: Response, next: NextFunction) => Promise<void>
        = async (req, res, next) => {
            try {

                let serverReq: ServerRequest = ServerRequestFactory.promote(req);
                let stack: RequestStack = RequestStack.digestRequest(req);

                if (stack.system() == "") {
                    this.answerServerStatus(res);
                    return;
                }

                if (!this.systems.has(stack.system())) {
                    throw new SystemUnavaliable("[Server] The requested system is not avaliable on this server! - " + stack.system());
                }

                // # ELSE, system exists in server
                let system = this.systems.get(stack.system())!;
                let systemRequest: SystemRequest = system.promoteToSystemRequest(serverReq, stack);
                
                // Sending the data through the Response object is a 'System' Responsability!
                let systemResponse = await system.handleRequest(systemRequest, res, next);

                console.log("System Response to request: ", systemResponse);
            }
            catch (ex) {
                let exc = ex as AuriaException;
                this.handleRequestException(exc, res);
            }
        };

    private answerServerStatus(response: Response) {
        
        let status: ServerResponse = {
            digest: "ok",
            error :"",
            exitCode: "SERVER.STATUS",
            response: {
                server_status: this.serverStatus
            }
        };

        response.send(status);
    }

    private handleRequestException(exception: AuriaException, response: Response) {

        console.error("[Server] Failed to proccess request!", exception);

        response.status(exception.getHttpCode());

        let sendArgs: any = {
            digest: "error",
            code: exception.getCode(),
            message: exception.getMessage()
        };

        if (exception.getExtraArgs().length > 0) {
            sendArgs.extra = exception.getExtraArgs();
        }

        response.send(sendArgs);
    }

    constructor(app: Express) {

        console.log("\n[Auria Server] Initializing a new Auria server!");

        this.app = app;
        this.systems = new Map();
        this.serverInstanceId = Math.round(Math.random() * 10000000);

        this.auriaBootInfo = {
            boot_server_random_id: this.serverInstanceId,
            boot_timestamp: Date.now()
        };

        this.initializeExpressApp();

        this.addSystem(
            //new AuriaCoreSystem(),
            new AuriaSystem("test")
        );

    }

    /**
     * Load Express modules
     * --------------------
     * Common to ALL SYSTEMS under this server!
     * > BodyParser: URL Encoded + JSON
     * > CookieParser
     * > Disable X-Powered-By Header (security trough obscurity?)
     * > CORS (?)
     */
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

export const AURIA_LOG_ROOT = __dirname + "/logs";
