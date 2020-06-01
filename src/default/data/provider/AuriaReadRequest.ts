import { ServerReadRequestOperations, ServerReadRequest } from "../../../kernel/database/dataSteward/provider/ServerReadRequest.js";

export class AuriaReadRequest extends ServerReadRequest {

    protected operation : ServerReadRequestOperations = ServerReadRequestOperations.FETCH_MODELS;

}

