"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const AuriaCoreSystem_1 = require("./system/AuriaCore/AuriaCoreSystem");
const AuriaResponse_1 = require("./kernel/http/AuriaResponse");
const AuriaRequest_1 = require("./kernel/http/AuriaRequest");
const SystemUnavaliable_1 = require("./kernel/exceptions/kernel/SystemUnavaliable");
exports.Auria_ENV = "development";
class AuriaServer {
    constructor(app) {
        /**
         * Server public status
         * --------------------
         *
         * Online -> requests are handled normally
         * Offline -> requests are rejected
         * Maintenance -> only some features might work
         */
        this.serverStatus = "online";
        /**
         * Function to be called each time a request by a client is made
         */
        this.requestHandler = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let aReq = new AuriaRequest_1.AuriaRequest(req);
            let aRes = new AuriaResponse_1.AuriaResponse(res, next);
            try {
                // empty system name might be empty URL
                if (aReq.getSystemName() == "") {
                    aRes.addToResponse({ status: "up" });
                    aRes.send();
                    return;
                }
                if (!this.systems.has(aReq.getSystemName())) {
                    throw new SystemUnavaliable_1.SystemUnavaliable("The especified system was not found in this server");
                }
                let system = this.systems.get(aReq.getSystemName());
                if (system != null) {
                    aReq.setSystem(system);
                    let user = yield aReq.digestUser();
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
                    }
                    else {
                        aRes.setDigestStatus('unauthorized');
                        aRes.send();
                    }
                }
            }
            catch (ex) {
                aRes.error(ex.code, ex.message);
            }
        });
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
        this.addSystem(new AuriaCoreSystem_1.AuriaCoreSystem(this));
        console.log("[Auria Server] Server Instance Token: " + this.serverSessionId);
    }
    /**
     * Add a System to this server
     *
     * @param system System to be added
     */
    addSystem(...system) {
        system.forEach((sys) => {
            console.log("[Auria Server] Adding system: ", sys.name);
            this.systems.set(sys.name, sys);
        });
        return this;
    }
    run() {
        this.app.all(/.*/, this.requestHandler);
        //@todo implement https server creation!
        //this.app.listen(this.port);
        return this;
    }
}
exports.AuriaServer = AuriaServer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXVyaWFTZXJ2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvQXVyaWFTZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNBLHdFQUFxRTtBQUVyRSwrREFBNEQ7QUFDNUQsNkRBQTBEO0FBQzFELG9GQUFpRjtBQUlwRSxRQUFBLFNBQVMsR0FBNEIsYUFBYSxDQUFDO0FBRWhFLE1BQWEsV0FBVztJQWtHcEIsWUFBWSxHQUFZO1FBM0Z4Qjs7Ozs7OztXQU9HO1FBQ0ksaUJBQVksR0FBc0IsUUFBUSxDQUFDO1FBa0JsRDs7V0FFRztRQUNLLG1CQUFjLEdBQ2hCLENBQU8sR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUV2QixJQUFJLElBQUksR0FBRyxJQUFJLDJCQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDakMsSUFBSSxJQUFJLEdBQUcsSUFBSSw2QkFBYSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUV4QyxJQUFJO2dCQUVBLHVDQUF1QztnQkFDdkMsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksRUFBRSxFQUFFO29CQUM1QixJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7b0JBQ3JDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDWixPQUFPO2lCQUNWO2dCQUVELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsRUFBRTtvQkFDekMsTUFBTSxJQUFJLHFDQUFpQixDQUFDLG9EQUFvRCxDQUFDLENBQUM7aUJBQ3JGO2dCQUVELElBQUksTUFBTSxHQUF1QixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztnQkFFeEUsSUFBSSxNQUFNLElBQUksSUFBSSxFQUFFO29CQUNoQixJ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