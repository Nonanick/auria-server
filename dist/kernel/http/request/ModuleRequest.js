let ModuleRequestFactory = /** @class */ (() => {
    class ModuleRequestFactory {
        static setFactoryFunction(fn) {
            ModuleRequestFactory.factoryFn = fn;
        }
        static make(request, user, module) {
            return ModuleRequestFactory.factoryFn(request, user, module);
        }
    }
    ModuleRequestFactory.factoryFn = (request, user, module) => {
        return Object.assign({
            getUser: () => user,
            getModule: () => module
        }, request);
    };
    return ModuleRequestFactory;
})();
export { ModuleRequestFactory };
