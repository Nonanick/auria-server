

import { DataStewardReadRequest, DataStewardReadResponse } from "aurialib2";
import { AuriaListenerActionMetadata } from "../listener/AuriaListenerActionMetadata.js";
import { AuriaReadRequest } from "../../data/provider/AuriaReadRequest.js";
import { ServerReadRequestOperations } from "../../../kernel/database/dataSteward/provider/ServerReadRequest.js";
import { ModuleListener } from "../../../kernel/module/api/ModuleListener.js";
import { Module } from "../../../kernel/module/Module.js";
import { ListenerAction } from "../../../kernel/module/api/ListenerAction.js";


export class ProviderListener extends ModuleListener {



    constructor(module: Module) {
        super(module, "Provider");

    }

    public getMetadataFromExposedActions(): AuriaListenerActionMetadata {
        return {
            "stream": {
                DISABLE_WHITELIST_RULE: true,
                accessRules: [
                    {
                        name: "UserCanAccessDataStream",
                        rule: async (context) => {
                            return true;
                        }
                    }
                ]
            },
            "subscribe": {
                DISABLE_WHITELIST_RULE: true,
                accessRules: [
                    {
                        name: "UserCanSubscribeToDataStream",
                        rule: async (context) => {

                            let request = new AuriaReadRequest(context.user);
                            request.setReadOperation(ServerReadRequestOperations.CHECK_PERMISSION);

                            let response = context.system.getDataSteward().read(request);
                            return response.then((hasPermissionResponse : DataStewardReadResponse) => {
                                return hasPermissionResponse.successful();
                            });
                        }
                    }
                ]
            },
            "read": {
                DISABLE_WHITELIST_RULE: true,
                accessRules: [
                    {
                        name: "UserCanAccessRequestedData",
                        rule: async (context) => {
                            return true;
                        }
                    }
                ]
            }
        }
    }

    public subscribe: ListenerAction = (req) => {

    }

    public stream: ListenerAction = (req) => {

    };

    public read: ListenerAction = async (req) => {

        let readRequest = new DataStewardReadRequest(req.getUser());


        let response = this.module.getSystem().getDataSteward().read(readRequest);

        return response.then(
            (response: DataStewardReadResponse) => {
                return response.getModelsAsArray();
            }
        ).catch((err) => {
            console.error("[ProvideListener] Read request failed!", err);
            throw err;
        });
    }
}