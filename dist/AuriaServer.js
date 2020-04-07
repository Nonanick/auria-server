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
const SystemUnavaliable_1 = require("./kernel/exceptions/kernel/SystemUnavaliable");
const RequestStack_1 = require("./kernel/RequestStack");
const ServerRequest_1 = require("./kernel/http/request/ServerRequest");
const AuriaCoreSystem_1 = require("./system/AuriaCore/AuriaCoreSystem");
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
                let stack = RequestStack_1.RequestStack.digestURL(req.url);
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
        this.addSystem(new AuriaCoreSystem_1.AuriaCoreSystem(), new AuriaSystem_1.AuriaSystem("test"));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXVyaWFTZXJ2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvQXVyaWFTZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUdBLG9GQUFpRjtBQUNqRix3REFBcUQ7QUFDckQsdUVBQTBGO0FBRzFGLHdFQUFxRTtBQUNyRSx1REFBb0Q7QUFLdkMsUUFBQSxTQUFTLEdBQWtDLGFBQWEsQ0FBQztBQUV0RSxNQUFhLFdBQVc7SUErR3BCLFlBQVksR0FBWTtRQXJHeEI7Ozs7Ozs7V0FPRztRQUNJLGlCQUFZLEdBQXNCLFFBQVEsQ0FBQztRQW9CbEQ7Ozs7Ozs7O1dBUUc7UUFDSyxtQkFBYyxHQUNoQixDQUFPLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDdkIsSUFBSTtnQkFFQSxJQUFJLFNBQVMsR0FBa0Isb0NBQW9CLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNqRSxJQUFJLEtBQUssR0FBaUIsMkJBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUUxRCxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUU7b0JBQ3RCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDN0IsT0FBTztpQkFDVjtnQkFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUU7b0JBQ25DLE1BQU0sSUFBSSxxQ0FBaUIsQ0FBQyxtRUFBbUUsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztpQkFDckg7Z0JBRUQsa0NBQWtDO2dCQUNsQyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUUsQ0FBQztnQkFDL0MsSUFBSSxhQUFhLEdBQWtCLE1BQU0sQ0FB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