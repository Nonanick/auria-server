var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ServerRequestFactory } from './kernel/http/request/ServerRequest.js';
import { BootSequence } from 'aurialib2';
import { AuriaSystem } from './default/AuriaSystem.js';
import { RequestStack } from './kernel/RequestStack.js';
import { SystemUnavaliable } from './kernel/exceptions/kernel/SystemUnavaliable.js';
import { AuriaException } from './kernel/exceptions/AuriaException.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { ArchitectSystem } from './architect/ArchitecSystem.js';
export const Auria_ENV = "development";
export class AuriaServer {
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
                let serverReq = ServerRequestFactory.promote(req);
                let stack = RequestStack.digestRequest(req);
                if (stack.system() == "") {
                    this.answerServerStatus(res);
                    return;
                }
                if (!this.systems.has(stack.system())) {
                    throw new SystemUnavaliable("[Server] The requested system is not avaliable on this server! - " + stack.system());
                }
                // # ELSE, system exists in server
                let system = this.systems.get(stack.system());
                let systemRequest = system.promoteToSystemRequest(serverReq, stack);
                // Sending the data through the Response object is a 'System' Responsability!
                let systemResponse = yield system.handleRequest(systemRequest);
                this.sendSystemResponse(res, systemResponse);
            }
            catch (ex) {
                if (ex instanceof AuriaException) {
                    let exc = ex;
                    this.handleRequestException(exc, res);
                }
                else {
                    let nExc = new class extends AuriaException {
                        getCode() { return "SYS.SERVER.UNKNOWN_EXCEPTION"; }
                    }(ex);
                    this.handleRequestException(nExc, res);
                }
            }
        });
        console.log("\n[Auria Server] Initializing a new Auria server!");
        this.app = app;
        this.boot = new BootSequence();
        this.systems = new Map();
        this.serverInstanceId = Math.round(Math.random() * 10000000);
        this.auriaBootInfo = {
            boot_server_random_id: this.serverInstanceId,
            boot_timestamp: Date.now()
        };
        this.initializeExpressApp();
        this.addSystem(new AuriaSystem("test"), new AuriaSystem("Paper"), new ArchitectSystem());
    }
    sendSystemResponse(response, systemResponse) {
        let headers = systemResponse.getAllHeaders();
        let cookies = systemResponse.getAllCookies();
        let httpCode = systemResponse.getHttpStatusCode();
        let ansJson = systemResponse.asJSON();
        headers.forEach((headerInfo) => {
            response.setHeader(headerInfo.name, headerInfo.value);
        });
        cookies.forEach((cookieInfo) => {
            response.cookie(cookieInfo.name, cookieInfo.value, cookieInfo.options);
        });
        response.status(httpCode);
        response.json(ansJson);
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
            this.boot.addBootable("[System]" + sys.name, sys);
        });
        return this;
    }
    run() {
        this.app.all(/.*/, this.requestHandler);
        this.boot.initialize();
        return this;
    }
}
//# sourceMappingURL=AuriaServer.js.map