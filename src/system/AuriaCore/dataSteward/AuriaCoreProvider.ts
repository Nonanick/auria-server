import { DataStewardProvider, DataStewardReadRequest, DataStewardReadResponse } from "aurialib2";

export class AuriaCoreProvider extends DataStewardProvider {

    processReadRequest(request: DataStewardReadRequest): Promise<DataStewardReadResponse> {
        throw new Error("Method not implemented.");
    }
    
}