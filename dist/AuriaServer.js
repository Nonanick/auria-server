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
const SystemRequest_1 = require("./kernel/http/request/SystemRequest");
const SystemUnavaliable_1 = require("./kernel/exceptions/kernel/SystemUnavaliable");
const Este_1 = require("./system/Este/Este");
const RequestStack_1 = require("./kernel/RequestStack");
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
            try {
                let stack = RequestStack_1.RequestStack.digestURL(req.url);
                if (!this.systems.has(stack.system())) {
                    throw new SystemUnavaliable_1.SystemUnavaliable("[SystemRequest] The requested system is not avaliable on this server!");
                }
                let system = this.systems.get(stack.system());
                let systemRequest = SystemRequest_1.SystemRequestFactory.make(req, system, stack);
                let systemResponse = system.handleRequest(systemRequest, res, next);
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
        this.addSystem(new AuriaCoreSystem_1.AuriaCoreSystem(this), new Este_1.Este(this));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXVyaWFTZXJ2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvQXVyaWFTZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNBLHdFQUFxRTtBQUVyRSx1RUFBMEY7QUFDMUYsb0ZBQWlGO0FBQ2pGLDZDQUEwQztBQUMxQyx3REFBcUQ7QUFJeEMsUUFBQSxTQUFTLEdBQWtDLGFBQWEsQ0FBQztBQUd0RSxNQUFhLFdBQVc7SUE4RHBCLFlBQVksR0FBWTtRQXBEeEI7Ozs7Ozs7V0FPRztRQUNJLGlCQUFZLEdBQXNCLFFBQVEsQ0FBQztRQWtCbEQ7O1dBRUc7UUFDSyxtQkFBYyxHQUNoQixDQUFPLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDdkIsSUFBSTtnQkFFQSxJQUFJLEtBQUssR0FBa0IsMkJBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUUzRCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUU7b0JBQ25DLE1BQU0sSUFBSSxxQ0FBaUIsQ0FBQyx1RUFBdUUsQ0FBQyxDQUFDO2lCQUN4RztnQkFFRCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUUsQ0FBQztnQkFFL0MsSUFBSSxhQUFhLEdBQWtCLG9DQUFvQixDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNqRixJQUFJLGNBQWMsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBRXBFLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLEVBQUUsY0FBYyxDQUFDLENBQUM7YUFDL0Q7WUFDRCxPQUFPLEVBQUUsRUFBRTthQUVWO1FBQ0wsQ0FBQyxDQUFBLENBQUM7UUFLRixPQUFPLENBQUMsR0FBRyxDQUFDLG1EQUFtRCxDQUFDLENBQUM7UUFFakUsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDZixJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUU1QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsQ0FBQztRQUc1RCxPQUFPLENBQUMsR0FBRyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7UUFDdEQsSUFBSSxDQUFDLFNBQVMsQ0FDVixJQUFJLGlDQUFlLENBQUMsSUFBSSxDQUFDLEVBQ3pCLElBQUksV0FBSSxDQUFDLElBQUksQ0FBQyxDQUNqQixDQUFDO1FBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3Q0FBd0MsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7SUFFakYsQ0FBQztJQUVPLG9CQUFvQjtRQUV4QixJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDeEMsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBRTVDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3hELElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7UUFFN0IsdUJBQXVCO1FBQ3ZCLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksU0FBUyxDQUFDLEdBQUcsTUFBZ0I7UUFDaEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0NBQWdDLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3hELElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0sR0FBRztRQUVOLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFeEMsd0NBQXdDO1FBQ3hDLDZCQUE2QjtRQUU3QixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0NBQ0o7QUF0SEQsa0NBc0hDIn0=