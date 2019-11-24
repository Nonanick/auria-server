import { SystemRequest } from "./SystemRequest";
import { ModuleListener } from "../../module/ModuleListener";

export interface ListenerRequest extends SystemRequest {

    getTranslations(lang: string): { [translationKey: string]: string };

    getListener(): ModuleListener;

    getListenerName(): string;

}

export class ListenerRequestFactory {
    
    public static make(request: SystemRequest, listener: ModuleListener): ListenerRequest {

        let listRequest: ListenerRequest = Object.assign(
            {
                getTranslations: (lang: string) => {
                    return request.getSystem().getTranslator().getTranslations(lang)!;
                },
                getListener: () => listener,
                getListenerName: () => listener.name,
            },
            request);

        return listRequest;

    }
}