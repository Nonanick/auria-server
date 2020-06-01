export class SystemRequestFactory {
    constructor() {
        /**
         * Factory function to be used to generate a SystemRequest
         * based on a Express Request object, the system that will
         * be handling the request
         *
         */
        this.factoryFn = (request, system, stack) => {
            let serverRequest = Object.assign({
                getSystemName: () => system.name,
                getRequestStack: () => stack
            }, request);
            return serverRequest;
        };
    }
    setFactoryFunction(fn) {
        this.factoryFn = fn;
    }
    make(request, system, stack) {
        return this.factoryFn(request, system, stack);
    }
}
