"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const SystemUnavaliable_1 = require("./kernel/exceptions/kernel/SystemUnavaliable");
const RequestStack_1 = require("./kernel/RequestStack");
const ServerRequest_1 = require("./kernel/http/request/ServerRequest");
const AuriaSystem_1 = require("./default/AuriaSystem");
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
                let stack = RequestStack_1.RequestStack.digestRequest(req);
                if (stack.system() == "") {
                    this.answerServerStatus(res);
                    return;
                }
                if (!this.systems.has(stack.system())) {
                    throw new SystemUnavaliable_1.SystemUnavaliable("[Server] The requested system is not avaliable on this server! - " + stack.system());
                }
                // # ELSE, system exists in server
                let system = this.systems.get(stack.system());
                let systemRequest = system.promoteToSystemRequest(serverReq, stack);
                // Sending the data through the Response object is a 'System' Responsability!
                let systemResponse = yield system.handleRequest(systemRequest, res, next);
                console.log("System Response to request: ", systemResponse);
            }
            catch (ex) {
                let exc = ex;
                this.handleRequestException(exc, res);
            }
        });
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
        new AuriaSystem_1.AuriaSystem("test"));
    }
    answerServerStatus(response) {
        let status = {
            digest: "ok",
            error: "",
            exitCode: "SERVER.STATUS",
            response: {
                server_status: this.serverStatus
            }
        };
        response.send(status);
    }
    handleRequestException(exception, response) {
        console.error("[Server] Failed to proccess request!", exception);
        response.status(exception.getHttpCode());
        let sendArgs = {
            digest: "error",
            code: exception.getCode(),
            message: exception.getMessage()
        };
        if (exception.getExtraArgs().length > 0) {
            sendArgs.extra = exception.getExtraArgs();
        }
        response.send(sendArgs);
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
exports.AURIA_LOG_ROOT = __dirname + "/logs";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXVyaWFTZXJ2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvQXVyaWFTZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFHQSxvRkFBaUY7QUFDakYsd0RBQXFEO0FBQ3JELHVFQUEwRjtBQUcxRix1REFBb0Q7QUFLdkMsUUFBQSxTQUFTLEdBQWtDLGFBQWEsQ0FBQztBQUV0RSxNQUFhLFdBQVc7SUErR3BCLFlBQVksR0FBWTtRQXJHeEI7Ozs7Ozs7V0FPRztRQUNJLGlCQUFZLEdBQXNCLFFBQVEsQ0FBQztRQW9CbEQ7Ozs7Ozs7O1dBUUc7UUFDSyxtQkFBYyxHQUNoQixDQUFPLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDdkIsSUFBSTtnQkFFQSxJQUFJLFNBQVMsR0FBa0Isb0NBQW9CLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNqRSxJQUFJLEtBQUssR0FBaUIsMkJBQVksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBRTFELElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRTtvQkFDdEIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUM3QixPQUFPO2lCQUNWO2dCQUVELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRTtvQkFDbkMsTUFBTSxJQUFJLHFDQUFpQixDQUFDLG1FQUFtRSxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO2lCQUNySDtnQkFFRCxrQ0FBa0M7Z0JBQ2xDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBRSxDQUFDO2dCQUMvQyxJQUFJLGFBQWEsR0FBa0IsTUFBTSxDQUFDLHNCQUFzQixDQUFDLFNBQVMsRUFB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