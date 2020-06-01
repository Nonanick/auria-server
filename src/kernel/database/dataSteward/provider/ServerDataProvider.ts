import { DataStewardProvider, DataStewardReadResponse } from 'aurialib2';
import { ServerReadRequestDigest } from './ServerReadRequestDigest.js';
import { ServerReadRequest, ServerReadRequestOperations } from './ServerReadRequest.js';
import { ServerReadResponse } from './ServerReadResponse.js';
import { System } from '../../../System.js';
import { ResourceManager } from '../../../resource/ResourceManager.js';
import { ReadOperationNotSupported } from '../../../exceptions/kernel/database/ReadOperationNotSupported.js';
import { ResourcePermissionResourceDefinition as ResourcePermission } from '../../../resource/systemSchema/resourcePermission/ResourcePermissionResourceDefinition.js';

export class ServerDataProvider extends DataStewardProvider {

    private requestDigests: {
        [operationName: string]: ServerReadRequestDigest
    } = {};

    protected system: System;

    protected resourceManager: ResourceManager;

    constructor(system: System, resourceManager: ResourceManager) {
        super();
        this.system = system;
        this.resourceManager = resourceManager;

        this.requestDigests[ServerReadRequestOperations.CHECK_PERMISSION] =
            async (request) => {
                let response = new ServerReadResponse(request);

                return response;
            };

        this.requestDigests[ServerReadRequestOperations.COUNT_RESULT];

        this.requestDigests[ServerReadRequestOperations.FETCH_MODELS];

        this.requestDigests[ServerReadRequestOperations.FETCH_ROWS];

    }

    protected async userCanAccesQueriedEntity(request: ServerReadRequest): Promise<boolean> {

        let resId = this.resourceManager.getResourceByName(request.getQueriedEntity()).getId();


        return this.system.getSystemConnection()
            .select("COUNT(" + ResourcePermission.columns.ID + ")")
            .from(ResourcePermission.tableName)
            .where(ResourcePermission.columns.ResourceID.columnName, resId)
            .then(() => {
                return true;
            });
    }

    public async digestRequest(request: ServerReadRequest): Promise<DataStewardReadResponse> {

        let response: DataStewardReadResponse;// = new DataStewardReadResponse(request);

        if (!this.getOperations().includes(request.getOperation())) {
            throw new ReadOperationNotSupported(
                "The requested read operation '" + request.getOperation() + "' was not found in the supported operations list!\n" +
                this.getOperations().join(", ")
            );
        }
        try {
            response = await this.requestDigests[request.getOperation()]!(request);
        } catch (err) {
            console.error("[AuriaProvider] Read operation failed! An Exception was raised: " + err);
            throw err;
        }

        return response;

    }

    public getOperations(): string[] {
        let ops: string[] = [];

        for (var operationName in this.requestDigests) {
            if (this.requestDigests.hasOwnProperty(operationName)) {
                ops.push(operationName);
            }
        }

        return ops;
    }

}