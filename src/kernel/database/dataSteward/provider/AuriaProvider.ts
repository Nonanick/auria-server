import { DataStewardProvider, DataStewardReadRequest, DataStewardReadResponse } from "aurialib2";

export class AuriaProvider extends DataStewardProvider {

    public async processReadRequest(request : DataStewardReadRequest) : Promise<DataStewardReadResponse> {
        throw new Error("AuriaProvider not implemented yet!");
    }

}