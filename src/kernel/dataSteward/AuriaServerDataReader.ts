import { DataStewardProvider, DataStewardReadRequest, DataStewardReadResponse } from "aurialib2";

export class AuriaServerDataReader extends DataStewardProvider {


    
    public digestRequest(request: DataStewardReadRequest): Promise<DataStewardReadResponse> {
        throw new Error("Method not implemented.");
    }
    
}