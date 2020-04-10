import { DataStewardProvider, DataStewardReadRequest, DataStewardReadResponse } from "aurialib2";

export class AuriaDataReader extends DataStewardProvider {
    
    constructor() {
        super();

    }

    digestRequest(request: DataStewardReadRequest): Promise<DataStewardReadResponse> {
        throw new Error("Method not implemented.");
    }
}