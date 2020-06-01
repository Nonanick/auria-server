/**
 * Login Request Factory
 * ----------------------
 * Extends an ModuleRequest object adding some functions necessary for the Login
 * Listener routines
 */
export class LoginRequestFactory {
    static make(request, response, system) {
        return Object.assign({}, request, {
            setCookie: (name, value, options) => {
                return response.cookie(name, value, options);
            },
            getSystem: _ => system,
            setHeader: (key, value) => response.setHeader(key, value),
            writeHeader: (key, value) => response.set(key, value),
            headerStatus: (code) => response.status(code),
        });
    }
}
