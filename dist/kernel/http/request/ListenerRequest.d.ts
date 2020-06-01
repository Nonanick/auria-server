import { ModuleRequest } from "./ModuleRequest.js";
import { ModuleListener } from "../../module/api/ModuleListener.js";
export interface ListenerRequest extends ModuleRequest {
    getTranslations(lang: string): {
        [translationKey: string]: string;
    };
    getListener(): ModuleListener;
    getListenerName(): string;
}
export declare class ListenerRequestFactory {
    static make(request: ModuleRequest, listener: ModuleListener): ListenerRequest;
}
