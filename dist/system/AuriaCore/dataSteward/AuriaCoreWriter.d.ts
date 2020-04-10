import { DataStewardWriter, DataStewardWriteRequest, DataStewardWriteResponse } from "aurialib2";
export declare class AuriaCoreWriter extends DataStewardWriter {
    digestRequest(request: DataStewardWriteRequest): Promise<DataStewardWriteResponse>;
}
