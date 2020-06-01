export class ListenerRequestFactory {
    static make(request, listener) {
        let listRequest = Object.assign({
            getTranslations: (lang) => {
                return {}; //request.getSystem().getTranslator().getTranslations(lang)!;
            },
            getListener: () => listener,
            getListenerName: () => listener.name,
        }, request);
        return listRequest;
    }
}
