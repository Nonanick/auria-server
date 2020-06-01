import { ResourceDataProcedures } from "../../../resource/systemSchema/resourcePermission/ResourcePermissionResourceDefinition.js";

export interface ModulePageRequirements {
    data? : ModulePageDataRequirements;
    actions? : ModulePageActionRequirements;
}

export type ModulePageDataRequirements = {
    [resourceName : string] : ResourceDataProcedures[]
};

export type ModulePageActionRequirements = {
    [listenerName : string] : ModulePageActionNames
};

export type ModulePageActionNames = string[];