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
const SystemAuthenticator_1 = require("../../security/auth/SystemAuthenticator");
const SystemUser_1 = require("../../security/SystemUser");
class AuriaSystemAuthenticator extends SystemAuthenticator_1.SystemAuthenticator {
    authenticate(user) {
        throw new Error("Method not implemented.");
    }
    isAuthenticated(user) {
        throw new Error("Method not implemented.");
    }
    digestUser(request) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = new SystemUser_1.SystemUser(request.getSystem(), "guest");
            return user;
        });
    }
}
exports.AuriaSystemAuthenticator = AuriaSystemAuthenticator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXVyaWFTeXN0ZW1BdXRoZXRpY2F0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMva2VybmVsL2RlZmF1bHQvc2VjdXJpdHkvQXVyaWFTeXN0ZW1BdXRoZXRpY2F0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLGlGQUE4RTtBQUU5RSwwREFBdUQ7QUFFdkQsTUFBYSx3QkFBeUIsU0FBUSx5Q0FBbUI7SUFFN0QsWUFBWSxDQUFDLElBQWdCO1FBQ3pCLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsZUFBZSxDQUFDLElBQWdCO1FBQzVCLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRVksVUFBVSxDQUFDLE9BQXNCOztZQUUxQyxJQUFJLElBQUksR0FBRyxJQUFJLHVCQUFVLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBR3hELE9BQU8sSUFBSSxDQUFDO1FBRWhCLENBQUM7S0FBQTtDQUVKO0FBbkJELDREQW1CQyJ9