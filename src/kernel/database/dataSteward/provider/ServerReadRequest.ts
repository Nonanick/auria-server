import { DataStewardReadRequest } from "aurialib2";
import { SystemUser } from "../../../security/user/SystemUser.js";

export class ServerReadRequest extends DataStewardReadRequest {

    /**
    * Read operation
    * --------------
    * 
    * Shall define what kind of reading will be done!
    * > CHECK_PERMISSION -> don't fetch any rows, only check if the user can access the requested resource  
    * > FETCH_MODELS -> fetch all rows as RowModels from that resource  
    * > FETCH_ROW -> fetch all rows as JS objects (associative array)  
    * > COUNT_RESULT -> count how many rows were returned by the query  
    * 
    */
    protected operation: ServerReadRequestOperations = ServerReadRequestOperations.FETCH_MODELS;

    protected user: SystemUser;

    constructor(user: SystemUser) {
        super(user);
    }

    public getUser(): SystemUser {
        return this.user;
    }

    public getOperation(): ServerReadRequestOperations {
        return this.operation;
    }

    

    public setReadOperation(operation: ServerReadRequestOperations) {
        this.operation = operation;
        return this;
    }

}

export enum ServerReadRequestOperations {
    CHECK_PERMISSION = "checkPermission",
    FETCH_MODELS = "fetchModels",
    FETCH_ROWS = "fetchRows",
    COUNT_RESULT = "countResults"
}