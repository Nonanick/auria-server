import { DataStewardProvider, DataStewardReadRequest, DataStewardReadResponse } from "aurialib2";
export declare class AuriaCoreProvider extends DataStewardProvider {
    processReadRequest(request: DataStewardReadRequest): Promise<DataStewardReadResponse>;
}
