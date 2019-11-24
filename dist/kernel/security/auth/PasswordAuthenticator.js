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
class PasswordAutheticator {
    constructor() {
        this.__authenticated = false;
    }
    authenticate() {
        throw new Error("Method not implemented.");
    }
    isAuthenticated() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.__authenticated;
        });
    }
    setCredentials(credentials) {
        this.__password = credentials.password;
        console.log("Use password: ", this.__password, " and never be able to get it again!");
        return this;
    }
}
exports.PasswordAutheticator = PasswordAutheticator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFzc3dvcmRBdXRoZW50aWNhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2tlcm5lbC9zZWN1cml0eS9hdXRoL1Bhc3N3b3JkQXV0aGVudGljYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBRUEsTUFBYSxvQkFBb0I7SUFBakM7UUFFWSxvQkFBZSxHQUFhLEtBQUssQ0FBQztJQW1COUMsQ0FBQztJQWZHLFlBQVk7UUFDUixNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVLLGVBQWU7O1lBQ2pCLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQztRQUNoQyxDQUFDO0tBQUE7SUFFRCxjQUFjLENBQUMsV0FBaUM7UUFDNUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDO1FBQ3ZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxxQ0FBcUMsQ0FBQyxDQUFDO1FBQ3RGLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FHSjtBQXJCRCxvREFxQkMifQ==