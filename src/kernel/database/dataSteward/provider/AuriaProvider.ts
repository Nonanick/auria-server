import { DataStewardProvider, DataStewardReadRequest, DataStewardReadResponse } from 'aurialib2';

export class AuriaProvider extends DataStewardProvider {

    digestRequest(request: DataStewardReadRequest): Promise<DataStewardReadResponse> {
        throw new Error("Method not implemented.");
    }

}