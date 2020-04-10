import { DataStewardProvider, DataStewardReadRequest, DataStewardReadResponse } from 'aurialib2';
export declare class AuriaProvider extends DataStewardProvider {
    digestRequest(request: DataStewardReadRequest): Promise<DataStewardReadResponse>;
}
