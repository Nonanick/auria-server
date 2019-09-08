"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ModuleListener_1 = require("../../ModuleListener");
const SystemUser_1 = require("../../../security/SystemUser");
const jwt = __importStar(require("jsonwebtoken"));
const Auth_1 = require("../../../../config/Auth");
class LoginListener extends ModuleListener_1.ModuleListener {
    constructor(module) {
        super(module, "LoginListener");
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let username = req.requiredParam('username');
            // Login with password
            if (req.hasParam('password')) {
                let password = req.requiredParam('password');
                let success = yield req.getUser()
                    .loginWithPassword(username, password);
                if (success) {
                    try {
                        let user = this.module.getSystem().getUser(username);
                        user.startSession(req);
                        user.buildUser();
                        let tokenPayload = user.generateTokenPayload();
                        let jwtString = jwt.sign(tokenPayload, Auth_1.AuthConfig.jwtSecret, {
                            expiresIn: 60 * 60 * 24
                        });
                        res.setCookie(SystemUser_1.SystemUser.COOKIE_HANDSHAKE, jwtString);
                        res.setCookie(SystemUser_1.SystemUser.COOKIE_USERNAME, username);
                        res.addToResponse({
                            loggedIn: true
                        });
                        res.send();
                    }
                    catch (error) {
                        res.error("20001", "Failed to locate user!");
                    }
                }
                else {
                    res.error("20002", "Login attempt failed!");
                }
            }
            else {
                throw new Error("[Login] Insufficient parameters were passed!");
            }
        });
        this.handshake = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let username = req.requiredParam('username');
            let cookieHandshake = req.getCookie('AURIA_UA_USERNAME');
            let handshakeToken = req.getCookie('AURIA_UA_HANDSHAKE');
            if (cookieHandshake != username) {
                console.log("Username [" + username + "], Cookie [" + cookieHandshake + "]");
                throw new Error("[Login] Handshake failed!");
            }
            let loggedIn = this.module.getSystem().getUser(username);
            let loginPaylodToken = jwt.verify(handshakeToken, Auth_1.AuthConfig.jwtSecret, {
                maxAge: "2d"
            });
            if (typeof loginPaylodToken == "string") {
                res.error("20009", "Invalid token!");
                return;
            }
            // # - Already logged in ?
            if (loggedIn != null) {
                let matchAuth = loggedIn.verifyLoginPayload(loginPaylodToken);
                if (matchAuth) {
                    res.addToResponse({
                        handshake: true
                    });
                    res.send();
                    return;
                }
                else {
                    res.error("99", "Invalid Payload, please login");
                }
            }
            // # - Not logged in
            else {
                let log = yield req.getUser().loginWithPayload(loginPaylodToken);
                if (log) {
                    req.getUser().buildUser();
                    res.addToResponse({
                        handshake: true
                    });
                    res.send();
                    return;
                }
                else {
                    res.error("98", "Invalid Payload, please login");
                }
            }
        });
        this.logout = (req, res) => {
            let username = req.requiredParam("username");
            let cookie = req.getCookie('AURIA_UA_USERNAME');
            //let handshake = req.getCookie('AURIA_UA_HANDSHAKE');
            if (username == cookie) {
                res.setCookie("AURIA_UA_USERNAME", "", -1, true);
                res.setCookie("AURIA_UA_HANDSHAKE", "", -1, true);
                this.module.getSystem().removeUser(username);
                res.addToResponse({ "logout": true });
            }
            else {
                res.error("20006", "Failed to log out user!");
            }
        };
    }
    getRequiredRequestHandlers() {
        return [];
    }
    getExposedActionsDefinition() {
        return {
            "login": {},
            "handshake": {},
            "keepalive": {},
            "logout": {},
        };
    }
}
exports.LoginListener = LoginListener;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9naW5MaXN0ZW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9rZXJuZWwvbW9kdWxlL1N5c3RlbU1vZHVsZS9saXN0ZW5lcnMvTG9naW5MaXN0ZW5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlEQUFpRztBQUVqRyw2REFBMEQ7QUFDMUQsa0RBQW9DO0FBQ3BDLGtEQUFxRDtBQUdyRCxNQUFhLGFBQWMsU0FBUSwrQkFBYztJQU03QyxZQUFZLE1BQWM7UUFDdEIsS0FBSyxDQUFDLE1BQU0sRUFBRSxlQUFlLENBQUMsQ0FBQztRQVk1QixVQUFLLEdBQW1CLENBQU8sR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBRTlDLElBQUksUUFBUSxHQUFXLEdBQUcsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFckQsc0JBQXNCO1lBQ3RCLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsRUFBRTtnQkFDMUIsSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDN0MsSUFBSSxPQUFPLEdBQ1AsTUFBTSxHQUFHLENBQUMsT0FBTyxFQUFFO3FCQUNkLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFFL0MsSUFBSSxPQUFPLEVBQUU7b0JBQ1QsSUFBSTt3QkFDQSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQWUsQ0FBQzt3QkFDbkUsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDdkIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUNqQixJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQzt3QkFDL0MsSUFBSSxTQUFTLEdBQUcsR0FBRyxDQUFDLElBQUks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