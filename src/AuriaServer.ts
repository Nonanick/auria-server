import { Express, Request, Response, NextFunction } from 'express-serve-static-core';
import { AuriaCoreSystem } from './system/AuriaCore/AuriaCoreSystem';
import { System } from './kernel/System';
import { AuriaResponse } from './kernel/http/AuriaResponse';
import { AuriaRequest } from './kernel/http/AuriaRequest';
import { SystemUnavaliable } from './kernel/exceptions/kernel/SystemUnavaliable';

export type AuriaServerStatus = "online" | "offline" | "maintenance";

export const Auria_ENV : "development" | "prod" = "development";

export class AuriaServer {

    /**
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

            let aReq = new AuriaRequest(req);
            let aRes = new AuriaResponse(res, next);

            try {

                // empty system name might be empty URL
                if (aReq.getSystemName() == "") {
                    aRes.addToResponse({ status: "up" });
                    aRes.send();
                    return;
                }

                if (!this.systems.has(aReq.getSystemName())) {
                    throw new SystemUnavaliable("The especified system was not found in this server");
                }

                let system: System | undefined = this.systems.get(aReq.getSystemName());

                if (system != null) {
                    aReq.setSystem(system);
                    let user = await aReq.digestUser();
                    var accessManager = system.getSystemAccessManager();
                    accessManager.setUser(user);
                    accessManager.loadRequestStack(aReq);

                    let canAccess = accessManager.canAccessRequest(aReq);

                    if (canAccess) {
                        /*
                                                aRes.addToResponse({
                                                    auria_server_version: this.serverSessionId,
                                                    auria_processedRequest: aReq.digestUrl(),
                                                    auria_requestBody: aReq.getBody()
                                                });
                        */

                        let action = accessManager.getListenerAction();

                        let ans = action(aReq, aRes);

                        if (ans instanceof Promise) {
                            ans.catch((err) => {
                                console.error("[Server] Failed to proccess request! ", err);
                                aRes.error("00001", err);
                            });
                        }

                    } else {
                        aRes.setDigestStatus('unauthorized');
                        aRes.send();
                    }
                }
            } catch (ex) {
                aRes.error(ex.code, ex.message);
            }

        };

    constructor(app: Express) {

        console.log("\n[Auria Server] Initializing a new Auria server!");

        var bodyParser = require('body-parser');
        var cookieParser = require('cookie-parser');

        this.app = app;

        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());

        //this.app.use(cors());

        this.app.disable("x-powered-by");

        this.systems = new Map();
        this.serverSessionId = Math.round(Math.random() * 10000000);

        console.log("[Auria Server] Initializing Systems...");
        
        this.addSystem(
            new AuriaCoreSystem(this)
        );

        console.log("[Auria Server] Server Instance Token: " + this.serverSessionId);

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