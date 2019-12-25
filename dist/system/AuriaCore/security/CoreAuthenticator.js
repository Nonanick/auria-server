"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Auth_1 = require("../../../config/Auth");
const PasswordAuthenticator_1 = require("../../../kernel/security/auth/PasswordAuthenticator");
class CoreAuthenticator extends PasswordAuthenticator_1.PasswordAutheticator {
    constructor(system) {
        super(system);
        this.jwtConfig = Auth_1.AuthConfig;
    }
    getJwtSecret() {
        return this.jwtConfig.jwtSecret;
    }
}
exports.CoreAuthenticator = CoreAuthenticator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29yZUF1dGhlbnRpY2F0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc3lzdGVtL0F1cmlhQ29yZS9zZWN1cml0eS9Db3JlQXV0aGVudGljYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLCtDQUFrRTtBQUNsRSwrRkFBMkY7QUFFM0YsTUFBYSxpQkFBa0IsU0FBUSw0Q0FBb0I7SUFJdkQsWUFBWSxNQUF1QjtRQUMvQixLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDZCxJQUFJLENBQUMsU0FBUyxHQUFHLGlCQUFVLENBQUM7SUFDaEMsQ0FBQztJQUVTLFlBQVk7UUFDbEIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQztJQUNwQyxDQUFDO0NBSUo7QUFmRCw4Q0FlQyJ9