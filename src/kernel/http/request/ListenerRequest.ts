import { ModuleRequest } from "./ModuleRequest.js";import { ModuleListener } from "../../module/api/ModuleListener.js";

export interface ListenerRequest extends ModuleRequest {

    getTranslations(lang: string): { [translationKey: string]: string };

    getListener(): ModuleListener;

    getListenerName(): string;

}

export class ListenerRequestFactory {
    
    public static make(request: ModuleRequest, listener: ModuleListener): ListenerRequest {

        let listRequest: ListenerRequest = Object.assign(
            {
                getTranslations: (lang: string) => {
                    return {};//request.getSystem().getTranslator().getTranslations(lang)!;
                },
                getListener: () => listener,
                getListenerName: () => listener.name,
            },
            request);

        return listRequest;

    }
}