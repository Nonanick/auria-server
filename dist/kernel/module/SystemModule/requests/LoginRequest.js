/**
 * Login Request Factory
 * ----------------------
 * Extends an ModuleRequest object adding some functions necessary for the Login
 * Listener routines
 */
export class LoginRequestFactory {
    static make(request, system) {
        return Object.assign({}, request, {
            getSystem: _ => system,
        });
    }
}
//# sourceMappingURL=LoginRequest.js.map