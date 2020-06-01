import { ConnectionTableDefinition } from "./connection/ConnectionResourceDefinition.js";
import { ResourceResourceDefinition } from "./resource/ResourceResourceDefinition.js";
import { ColumnResourceDefinition } from "./resourceColumn/ColumnResourceDefinition.js";
import { ModuleResourceDefinition } from "./module/ModuleResourceDefitinion.js";
import { ModuleMenuResourceDefinition } from "./moduleMenu/ModuleMenuResourceDefinition.js";
import { ModulePageResourceDefinition } from "./modulePage/ModulePageResourceDefinition.js";
import { ResourceAccessPolicyResourceDefinition } from "./resourceAccessPolicy/ResourceAccessPolicyResourceDefinition.js";
import { ResourceActivityResourceDefinition } from "./resourceActivity/ResourceActivityResourceDefinition.js";
import { ResourcePermissionResourceDefinition } from "./resourcePermission/ResourcePermissionResourceDefinition.js";
import { RoleResourceDefinition } from "./role/RoleResourceDefinition.js";
import { UserResourceDefinition } from "./user/UserResourceDefinition.js";
import { UserRoleResourceDefintion } from "./userRole/UserRoleResourceDefintion.js";
import { ResourceAccessShareResourceDefinition } from "./resourceAccessShare/ResourceAccessShareResourceDefinition.js";
import { UserInfoResourceDefinition } from "./userInfo/UserInfoResourceDefinition.js";
import { SessionResourceDefinition } from "./session/SessionResourceDefinition.js";
import { ModulePagePermissionResourceDefinition } from "./modulePagePermission/ModulePagePermissionResourceDefinition.js";

export const SystemSchema = {
    Connection: ConnectionTableDefinition,
    Module: ModuleResourceDefinition,
    ModuleMenu: ModuleMenuResourceDefinition,
    ModulePage: ModulePageResourceDefinition,
    ModulePagePermission: ModulePagePermissionResourceDefinition,
    Resource: ResourceResourceDefinition,
    ResourceAccessPolicy: ResourceAccessPolicyResourceDefinition,
    ResourceAccessShare: ResourceAccessShareResourceDefinition,
    ResourceActivity: ResourceActivityResourceDefinition,
    ResourceColumn: ColumnResourceDefinition,
    ResourcePermission: ResourcePermissionResourceDefinition,
    Role: RoleResourceDefinition,
    Session : SessionResourceDefinition,
    User: UserResourceDefinition,
    UserRole: UserRoleResourceDefintion,
    UserInfo : UserInfoResourceDefinition,
};