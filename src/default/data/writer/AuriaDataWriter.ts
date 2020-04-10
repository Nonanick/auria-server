import { DataStewardWriter, DataStewardWriteRequest, DataStewardWriteResponse } from "aurialib2";

export class AuriaDataWriter extends DataStewardWriter {

    digestRequest(request: DataStewardWriteRequest): Promise<DataStewardWriteResponse> {
        throw new Error("Method not implemented.");
    }

}