import { DataStewardProvider, DataStewardReadRequest, DataStewardReadResponse } from "aurialib2";
export declare class AuriaCoreProvider extends DataStewardProvider {
    digestRequest(request: DataStewardReadRequest): Promise<DataStewardReadResponse>;
}
