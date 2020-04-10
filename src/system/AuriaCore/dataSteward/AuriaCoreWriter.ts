import { DataStewardWriter, DataStewardWriteRequest, DataStewardWriteResponse } from "aurialib2";

export class AuriaCoreWriter extends DataStewardWriter {

    digestRequest(request: DataStewardWriteRequest): Promise<DataStewardWriteResponse> {
        throw new Error("Method not implemented.");
    }
    
}