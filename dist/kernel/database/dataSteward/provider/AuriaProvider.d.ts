import { DataStewardProvider, DataStewardReadRequest, DataStewardReadResponse } from 'aurialib2';
export declare class AuriaProvider extends DataStewardProvider {
    processReadRequest(request: DataStewardReadRequest): Promise<DataStewardReadResponse>;
}
