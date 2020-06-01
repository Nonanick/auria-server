import { DataStewardProvider, DataStewardReadResponse } from "aurialib2";
import { AuriaSystem } from "../../AuriaSystem.js";
import { AuriaReadRequest } from "./AuriaReadRequest.js";
import { ServerReadRequestOperations } from "../../../kernel/database/dataSteward/provider/ServerReadRequest.js";
import { ResourcePermissionResourceDefinition } from "../../../kernel/resource/systemSchema/resourcePermission/ResourcePermissionResourceDefinition.js";
import { SystemUser } from "../../../kernel/security/user/SystemUser.js";


export class AuriaDataReader extends DataStewardProvider {

    protected system: AuriaSystem;

    constructor(system: AuriaSystem) {
        super();

        this.system = system;

    }

    public async digestRequest(request: AuriaReadRequest): Promise<DataStewardReadResponse> {

        let operation = request.getOperation();
        let response = new DataStewardReadResponse(request);

        let haveAccess = await this.checkUserPermission(request.getUser() as SystemUser, request.getQueriedEntity());
        response.setSuccess(haveAccess);

        if (operation == ServerReadRequestOperations.CHECK_PERMISSION)
            return response;

        if (!haveAccess) {
            response.addError("DATA_STEWARD.USER_CANT_READ_RESOURCE");
            return response;
        }


        return response;

    }

    /**
     * Check User Permission
     * -----------------------
     * 
     * Will check if user have a "read" permission set on the DataPermission table
     * Either the permission is given to him directly by "user_id" or for one of its accessible 
     * roles through "user_role"
     * 
     * @param user 
     * @param resource 
     */
    public async checkUserPermission(user: SystemUser, resource: string): Promise<boolean> {
        let accessRoles = await user.getUserAccessibleRoleIds();

        return this.system.getSystemConnection()
            .select().from(ResourcePermissionResourceDefinition.tableName)
            //# - User ID *OR* User Role ID matches
            .andWhere(async function () {
                this.whereIn("user_role", accessRoles)
                    .orWhere("user_id", user.getId())
            })
            //# - Look for 'read' permission
            .where('permission', 'like', 'read')
            //# - On requested table
            .where('resource_name', resource)
            .then((results) => {
                console.log("[AuriaDataReader] Permission result to resource access! ", results);
                return results.length > 0;
            });
    }
}