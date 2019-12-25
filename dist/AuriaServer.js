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
const SystemUnavaliable_1 = require("./kernel/exceptions/kernel/SystemUnavaliable");
const RequestStack_1 = require("./kernel/RequestStack");
const ServerRequest_1 = require("./kernel/http/request/ServerRequest");
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
         * [HTTP Request Entry Point]
         * Request Handler
         * ---------------
         * Function to be called each time an HTTP request is made
         * will try to forward the request to the system responsible
         * for handling it;
         *
         */
        this.requestHandler = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let serverReq = ServerRequest_1.ServerRequestFactory.promote(req);
                let stack = RequestStack_1.RequestStack.digestURL(req.url);
                if (!this.systems.has(stack.system())) {
                    throw new SystemUnavaliable_1.SystemUnavaliable("[SystemRequest] The requested system is not avaliable on this server!");
                }
                // # ELSE, system exists in server
                let system = this.systems.get(stack.system());
                let systemRequest = system.promoteToSystemRequest(serverReq, stack);
                let systemResponse = system.handleRequest(systemRequest, res, next);
                if (systemResponse instanceof Promise) {
                    systemResponse.then((ans) => {
                        console.log("[Server] Respons to request: ", ans);
                        res.send(ans);
                    }).catch((err) => {
                        let exc = err;
                        console.error("[Server] Failed to process request!", exc);
                        res.status(400);
                        res.send({
                            code: exc.getCode(),
                            message: exc.getMessage()
                        });
                    });
                }
                else {
                }
                console.log("System Response to request: ", systemResponse);
            }
            catch (ex) {
            }
        });
        console.log("\n[Auria Server] Initializing a new Auria server!");
        this.app = app;
        this.initializeExpressApp();
        this.systems = new Map();
        this.serverSessionId = Math.round(Math.random() * 10000000);
        console.log("[Auria Server] Initializing Systems...");
        this.addSystem(new AuriaCoreSystem_1.AuriaCoreSystem());
        console.log("[Auria Server] Server Instance Token: " + this.serverSessionId);
    }
    initializeExpressApp() {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXVyaWFTZXJ2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvQXVyaWFTZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNBLHdFQUFxRTtBQUdyRSxvRkFBaUY7QUFDakYsd0RBQXFEO0FBQ3JELHVFQUEwRjtBQU83RSxRQUFBLFNBQVMsR0FBa0MsYUFBYSxDQUFDO0FBRXRFLE1BQWEsV0FBVztJQXNGcEIsWUFBWSxHQUFZO1FBNUV4Qjs7Ozs7OztXQU9HO1FBQ0ksaUJBQVksR0FBc0IsUUFBUSxDQUFDO1FBa0JsRDs7Ozs7Ozs7V0FRRztRQUNLLG1CQUFjLEdBQ2hCLENBQU8sR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUN2QixJQUFJO2dCQUVBLElBQUksU0FBUyxHQUFrQixvQ0FBb0IsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRWpFLElBQUksS0FBSyxHQUFpQiwyQkFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRTFELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRTtvQkFDbkMsTUFBTSxJQUFJLHFDQUFpQixDQUFDLHVFQUF1RSxDQUFDLENBQUM7aUJBQ3hHO2dCQUVELGtDQUFrQztnQkFDbEMsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFFLENBQUM7Z0JBQy9DLElBQUksYUFBYSxHQUFrQixNQUFNLENBQUMsc0JBQXNCLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNuRixJQUFJLGNBQWMsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBRXBFLElBQUksY0FBYyxZQUFZLE9BQU8sRUFB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