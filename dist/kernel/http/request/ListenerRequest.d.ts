import { SystemRequest } from "./SystemRequest";
import { ModuleListener } from "../../module/ModuleListener";
export interface ListenerRequest extends SystemRequest {
    getTranslations(lang: string): {
        [translationKey: string]: string;
    };
    getListener(): ModuleListener;
    getListenerName(): string;
}
export declare class ListenerRequestFactory {
    static make(request: SystemRequest, listener: ModuleListener): ListenerRequest;
}
