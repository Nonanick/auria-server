"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const aurialib2_1 = require("aurialib2");
const UserRole_1 = require("./UserRole");
const DataAccessPolicy_1 = require("../module/accessPolicy/data/DataAccessPolicy");
const ParameterAlreadyInitialized_1 = require("../exceptions/ParameterAlreadyInitialized");
class SystemUser extends aurialib2_1.User {
    constructor(system, username) {
        super();
        /**
         * Username
         * ---------
         *
         * Unique identifier of the user in the system
         */
        this.username = SystemUser.GUEST_USERNAME;
        /**
         * User Access Level
         * ------------------
         *
         * Level of access this user possess
         */
        this.accessLevel = SystemUserPrivilege.GUEST;
        this.username = username;
        this.system = system;
        this.trackingModels = new Map();
        this.userTables = new Map();
        this.roles = [];
        this.canAccessRoles = [];
    }
    getRoleBadge() {
        return this.roleBadge;
    }
    setRoleBadge(badge) {
        if (this.getUserAccessRoleIds().indexOf(badge.getId()) >= 0) {
            this.roleBadge = badge;
        }
        else {
            console.error("[SystemUser] User cant wear a badge he does not have access to!");
        }
        return this;
    }
    trackModels(table, modelsId) {
        if (this.trackingModels.has(table)) {
            let arr = this.trackingModels.get(table);
            for (var c = 0; c < modelsId.length; c++)
                arr.add(modelsId[c]);
        }
        else {
            this.trackingModels.set(table, new Set(modelsId));
        }
    }
    getTrackingModelsFrom(table) {
        if (this.trackingModels.get(table) != null)
            return this.trackingModels.get(table);
        else
            return new Set();
    }
    clearTrackingModels(table) {
        this.trackingModels.delete(table);
    }
    getAccessLevel() {
        return this.accessLevel;
    }
    setAccessLevel(level) {
        this.accessLevel = level;
        return this;
    }
    getUsername() {
        return this.username;
    }
    startSession(request) {
        if (this.loginTime == null) {
            this.loginTime = Date.now();
            this.ip = request.getIp();
            this.userAgent = request.getUserAgent();
            this.buildUser();
        }
        else {
            throw new ParameterAlreadyInitialized_1.ParameterAlreadyInitialized("User session already started!");
        }
    }
    buildUser() {
        this.buildUserRoles()
            .then(([userHiredRoles, userAccessRoles]) => {
            console.log("[SystemUser] User logged in and have this roles:", userHiredRoles, "\nBut also hav access to this roles:", userAccessRoles);
        });
        this.buildUserInformation();
        this.buildDataPermission();
        this.buildAccessPermission();
        console.log("[SystemUser] Login request ended on server side!\n", "Finished building user information, will probably make a promise to control the user state!", this.username);
    }
    buildAccessPermission() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    buildDataPermission() {
        return __awaiter(this, void 0, void 0, function* () {
            this.dataPermission = new DataAccessPolicy_1.DataPermission(this);
            return this.dataPermission;
        });
    }
    queryForUserRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve()
                .then(_ => {
                let conn = this.system.getSystemConnection();
                return conn.select("user_roles._id as hire_id", "user_roles.role_id", "user_roles.description as hire_description", "role.name", "role.title as role_title", "role.description as role_description", "role.icon")
                    .from("user_roles")
                    .leftJoin("role", "role._id", "user_roles.role_id")
                    .where("username", this.username);
            });
        });
    }
    buildUserRolesFromQueryResult(res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(res)) {
                res.forEach((userRoleInfo) => {
                    let role = new UserRole_1.UserRole(this);
                    role.setInfo(userRoleInfo);
                    this.roles[role.getId()] = role;
                });
                return this.roles;
            }
            else {
                throw new Error("[SystemUser] Failed to find roles to this user");
            }
        });
    }
    queryForUserAcessibleRoles(userRoles) {
        return __awaiter(this, void 0, void 0, function* () {
            let rolesId = [];
            userRoles.forEach((val) => {
                if (val != null)
                    rolesId.push(val.getId());
            });
            if (rolesId.length == 0) {
                return Promise.resolve().then(() => { return []; });
            }
            let accessRolesQuery = "\
        WITH RECURSIVE access_roles AS (\
            SELECT \
                role._id, \
                role.name, role.title, role.description, role.icon, \
                role.parent_role \
            FROM role \
            WHERE role.parent_role IS NULL AND role._id IN (" + rolesId.join(' , ') + ") \
            UNION ALL  \
            SELECT \
                role._id, \
                role.name, role.title, role.description, role.icon, \
                role.parent_role \
            FROM role \
            INNER JOIN access_roles ON access_roles._id = role.parent_role \
        ) \
        SELECT * FROM access_roles";
            let conn = this.system.getSystemConnection();
            return conn.raw(accessRolesQuery);
        });
    }
    buildUserAcessibleRolesFromQuery(queryResult) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve()
                .then(() => {
                if (Array.isArray(queryResult)) {
                    queryResult.forEach((rowInfo) => {
                        let accessRole = new UserRole_1.UserRole(this);
                        let roleInfo = {
                            role_id: rowInfo._id,
                            role_description: rowInfo.description,
                            role_title: rowInfo.title,
                            icon: rowInfo.icon,
                            name: rowInfo.name
                        };
                        // If this role is one the user is hired for update its hire info
                        if (this.roles[accessRole.getId()] != null) {
                            let hiredRole = this.roles[accessRole.getId()];
                            roleInfo.hire_description = hiredRole.getHireDescription();
                            roleInfo.hire_id = hiredRole.getHireId();
                        }
                        accessRole.setInfo(roleInfo);
                        this.canAccessRoles[accessRole.getId()] = accessRole;
                    });
                }
                return [this.roles, this.canAccessRoles];
            });
        });
    }
    buildUserRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.buildUserRolesPromise == null) {
                this.buildUserRolesPromise = Promise.resolve()
                    // # Query for user roles 
                    .then(this.queryForUserRoles.bind(this))
                    // # Build user roles 
                    .then(this.buildUserRolesFromQueryResult.bind(this))
                    // # Query for user acessible roles that are acessible through hierarchy! 
                    .then(this.queryForUserAcessibleRoles.bind(this))
                    // # Build and return acessible rows with user rows
                    .then(this.buildUserAcessibleRolesFromQuery.bind(this));
                this.buildUserRolesPromise.catch((err) => {
                    console.error("[SystemUser] Build user roles failed! " + err);
                    console.error("[SystemUser] Could not build roles of user");
                });
            }
            return this.buildUserRolesPromise;
        });
    }
    getUserAgent() {
        return this.userAgent;
    }
    setUserAgent(userAgent) {
        this.userAgent = userAgent;
        return this;
    }
    setIp(ip) {
        this.ip = ip;
        return this;
    }
    getUserInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.buildUserInformation();
            return this.userInfo;
        });
    }
    buildUserInformation() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.buildUserInfoPromise == null) {
                this.buildUserInfoPromise = new Promise((resolve, reject) => {
                    let conn = this.system.getSystemConnection();
                    conn.select("firstname", "lastname", "treatment", "phone", "birth", "avatar")
                        .from("users_info")
                        .where("user_id", this._id)
                        .then((res) => {
                        if (Array.isArray(res)) {
                            if (res.length == 1) {
                                this.userInfo = res[0];
                            }
                            else {
                                reject("[SystemUser] Failed to pinpoint information about the user");
                            }
                        }
                    }).catch((err) => {
                        console.error("[SystemUser] Failed to fetch user information", err);
                        reject("[SystemUser] Failed to fetch user information!");
                    });
                });
            }
            return this.buildUserInfoPromise;
        });
    }
    setSystem(system) {
        if (this.system == null)
            this.system = system;
        else
            throw new ParameterAlreadyInitialized_1.ParameterAlreadyInitialized("User's System has already been set!");
        return this;
    }
    /**
     * User ID
     * ---------
     *
     * Unique identifier of the user in the system, can be set only ONCE
     * at login time
     *
     * @param _id
     */
    setId(_id) {
        if (this._id == null)
            this._id = _id;
        return this;
    }
    getId() {
        return this._id;
    }
    getLoginTime() {
        return this.loginTime;
    }
    getUserRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.buildUserRoles();
            return this.roles;
        });
    }
    getUserRoleIds() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.buildUserRoles();
            return this.roles.map((v) => {
                return v.getId();
            });
        });
    }
    getUserAccessRoles() {
        return this.canAccessRoles;
    }
    getUserAccessRoleIds() {
        return this.canAccessRoles.map((v) => {
            return v.getId();
        });
    }
    logout() {
        this.emit("logout", this.username);
        this.system.removeUser(this.username);
        this.roles = [];
        this.username = SystemUser.GUEST_USERNAME;
        this.accessLevel = SystemUserPrivilege.GUEST;
        this.canAccessRoles = [];
    }
}
exports.SystemUser = SystemUser;
SystemUser.GUEST_USERNAME = "guest";
SystemUser.COOKIE_USERNAME = "AURIA_UA_USERNAME";
SystemUser.COOKIE_HANDSHAKE = "AURIA_UA_HANDSHAKE";
SystemUser.SESSION_EXPIRE_TIME = 1000 * 60 * 60 * 24 * 2;
var SystemUserPrivilege;
(function (SystemUserPrivilege) {
    SystemUserPrivilege[SystemUserPrivilege["GUEST"] = 0] = "GUEST";
    SystemUserPrivilege[SystemUserPrivilege["NORMAL"] = 1] = "NORMAL";
    SystemUserPrivilege[SystemUserPrivilege["ADMIN"] = 5] = "ADMIN";
    SystemUserPrivilege[SystemUserPrivilege["SYSADMIN"] = 10] = "SYSADMIN";
    SystemUserPrivilege[SystemUserPrivilege["MASTER"] = 999] = "MASTER";
})(SystemUserPrivilege = exports.SystemUserPrivilege || (exports.SystemUserPrivilege = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3lzdGVtVXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9rZXJuZWwvc2VjdXJpdHkvU3lzdGVtVXNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHlDQUFpQztBQUdqQyx5Q0FBc0M7QUFDdEMsbUZBQThFO0FBQzlFLDJGQUF3RjtBQUl4RixNQUFhLFVBQVcsU0FBUSxnQkFBSTtJQXFJaEMsWUFBWSxNQUFjLEVBQUUsUUFBZ0I7UUFDeEMsS0FBSyxFQUFFLENBQUM7UUExSFo7Ozs7O1dBS0c7UUFDTyxhQUFRLEdBQVcsVUFBVSxDQUFDLGNBQWMsQ0FBQztRQVV2RDs7Ozs7V0FLRztRQUNPLGdCQUFXLEdBQVcsbUJBQW1CLENBQUMsS0FBSyxDQUFDO1FBc0d0RCxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUVyQixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7UUFFaEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDO0lBRTdCLENBQUM7SUFFTSxZQUFZO1FBQ2YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQzFCLENBQUM7SUFFTSxZQUFZLENBQUMsS0FBZTtRQUMvQixJQUFJLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDekQsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7U0FDMUI7YUFBTTtZQUNILE9BQU8sQ0FBQyxLQUFLLENBQUMsaUVBQWlFLENBQUMsQ0FBQztTQUNwRjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxXQUFXLENBQUMsS0FBYSxFQUFFLFFBQWU7UUFDN0MsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNoQyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQWEsQ0FBQztZQUNyRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUU7Z0JBQ3BDLEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDNUI7YUFBTTtZQUNILElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1NBQ3JEO0lBQ0wsQ0FBQztJQUVNLHFCQUFxQixDQUFDLEtBQWE7UUFDdEMsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJO1lBQ3RDLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFhLENBQUM7O1lBRWxELE9BQU8sSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRU0sbUJBQW1CLENBQUMsS0FBYTtRQUNwQyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRU0sY0FBYztRQUNqQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDNUIsQ0FBQztJQUVNLGNBQWMsQ0FBQyxLQUEwQjtRQUM1QyxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUN6QixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0sV0FBVztRQUNkLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN6QixDQUFDO0lBRU0sWUFBWSxDQUFDLE9BQXNCO1FBQ3RDLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLEVBQUU7WUFFeEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDNUIsSUFBSSxDQUFDLEVBQUUsR0FBRyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDMUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUM7WUFFeEMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1NBQ3BCO2FBQU07WUFDSCxNQUFNLElBQUkseURBQTJCLENBQUMsK0JBQStCLENBQUMsQ0FBQTtTQUN6RTtJQUNMLENBQUM7SUFFTSxTQUFTO1FBQ1osSUFBSSxDQUFDLGNBQWMsRUFBRTthQUNoQixJQUFJLENBQUMsQ0FBQyxDQUFDLGNBQWMsRUFBRSxlQUFlLENBQUMsRUFBRSxFQUFFO1lBQ3hDLE9BQU8sQ0FBQyxHQUFHLENBQ1Asa0RBQWtELEVBQ2xELGNBQWMsRUFDZCxzQ0FBc0MsRUFDdEMsZUFBZSxDQUNsQixDQUFDO1FBQ04sQ0FBQyxDQUFDLENBQUM7UUFDUCxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztRQUU1QixJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUMzQixJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUU3QixPQUFPLENBQUMsR0FBRyxDQUNQLG9EQUFvRCxFQUNwRCw2RkFBNkYsRUFDN0YsSUFBSSxDQUFDLFFBQVEsQ0FDaEIsQ0FBQztJQUNOLENBQUM7SUFFYSxxQkFBcUI7O1FBRW5DLENBQUM7S0FBQTtJQUVhLG1CQUFtQjs7WUFFN0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLGlDQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDL0MsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO1FBQy9CLENBQUM7S0FBQTtJQUVhLGlCQUFpQjs7WUFDM0IsT0FBTyxPQUFPLENBQUMsT0FBTyxFQUFFO2lCQUNuQixJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ04sSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO2dCQUU3QyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQ2QsMkJBQTJCLEVBQUUsb0JBQW9CLEVBQUUsNENBQTRDLEVBQy9GLFdBQVcsRUFBRSwwQkFBMEIsRUFBRSxzQ0FBc0MsRUFBRSxXQUFXLENBQUM7cUJBQzVGLElBQUksQ0FBQyxZQUFZLENBQUM7cUJBQ2xCLFFBQVEsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLG9CQUFvQixDQUFDO3FCQUNsRCxLQUFLLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMxQyxDQUFDLENBQUMsQ0FBQztRQUNYLENBQUM7S0FBQTtJQUVhLDZCQUE2QixDQUFDLEdBQVE7O1lBQ2hELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDcEIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFlBQVksRUFBRSxFQUFFO29CQUN6QixJQUFJLElBQUksR0FBRyxJQUFJLG1CQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzlCLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7b0JBQzNCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO2dCQUNwQyxDQUFDLENBQUMsQ0FBQztnQkFDSCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7YUFDckI7aUJBQU07Z0JBQ0gsTUFBTSxJQUFJLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO2FBQ3JFO1FBQ0wsQ0FBQztLQUFBO0lBRWEsMEJBQTBCLENBQUMsU0FBcUI7O1lBQzFELElBQUksT0FBTyxHQUFhLEVBQUUsQ0FBQztZQUMzQixTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7Z0JBQ3RCLElBQUksR0FBRyxJQUFJLElBQUk7b0JBQ1gsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUNsQyxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7Z0JBQ3JCLE9BQU8sT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3ZEO1lBRUQsSUFBSSxnQkFBZ0IsR0FBRzs7Ozs7Ozs2REFPOEIsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHOzs7Ozs7Ozs7bUNBU25ELENBQUM7WUFFNUIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1lBRTdDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3RDLENBQUM7S0FBQTtJQUVhLGdDQUFnQyxDQUFDLFdBQWdCOztZQUMzRCxPQUFPLE9BQU8sQ0FBQyxPQUFPLEVBQUU7aUJBQ25CLElBQUksQ0FDRCxHQUFHLEVBQUU7Z0JBQ0QsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxFQUFFO29CQUM1QixXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBNkIsRUFBRSxFQUFFO3dCQUNsRCxJQUFJLFVBQVUsR0FBRyxJQUFJLG1CQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBRXBDLElBQUksUUFBUSxHQUF3Qjs0QkFDaEMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHOzRCQUNwQixnQkFBZ0IsRUFBRSxPQUFPLENBQUMsV0FBVzs0QkFDckMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxLQUFLOzRCQUN6QixJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUk7NEJBQ2xCLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSTt5QkFDckIsQ0FBQzt3QkFFRixpRUFBaUU7d0JBQ2pFLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxJQUFJLEVBQUU7NEJBQ3hDLElBQUksU0FBUyxHQUFhLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7NEJBQ3pELFFBQVEsQ0FBQyxnQkFBZ0IsR0FBRyxTQUFTLENBQUMsa0JBQWtCLEVBQUUsQ0FBQzs0QkFDM0QsUUFBUSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMsU0FBUyxFQUFFLENBQUM7eUJBQzVDO3dCQUVELFVBQVUsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQzdCLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDO29CQUN6RCxDQUFDLENBQUMsQ0FBQztpQkFDTjtnQkFDRCxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDN0MsQ0FBQyxDQUFDLENBQUM7UUFDZixDQUFDO0tBQUE7SUFFYSxjQUFjOztZQUV4QixJQUFJLElBQUksQ0FBQyxxQkFBcUIsSUFBSSxJQUFJLEVBQUU7Z0JBRXBDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxPQUFPLENBQUMsT0FBTyxFQUFFO29CQUMxQywwQkFBMEI7cUJBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUN4QyxzQkFBc0I7cUJBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNwRCwwRUFBMEU7cUJBQ3pFLElBQUksQ0FBQyxJQUFJLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNqRCxtREFBbUQ7cUJBQ2xELElBQUksQ0FBQyxJQUFJLENBQUMsZ0NBQWdDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBRTVELElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtvQkFDckMsT0FBTyxDQUFDLEtBQUssQ0FBQyx3Q0FBd0MsR0FBRyxHQUFHLENBQUMsQ0FBQztvQkFDOUQsT0FBTyxDQUFDLEtBQUssQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO2dCQUNoRSxDQUFDLENBQUMsQ0FBQzthQUNOO1lBRUQsT0FBTyxJQUFJLENBQUMscUJBQXFCLENBQUM7UUFDdEMsQ0FBQztLQUFBO0lBRU0sWUFBWTtRQUNmLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUMxQixDQUFDO0lBRU0sWUFBWSxDQUFDLFNBQWlCO1FBQ2pDLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxLQUFLLENBQUMsRUFBVTtRQUNuQixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNiLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFWSxXQUFXOztZQUNwQixNQUFNLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1lBQ2xDLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUN6QixDQUFDO0tBQUE7SUFFYSxvQkFBb0I7O1lBQzlCLElBQUksSUFBSSxDQUFDLG9CQUFvQixJQUFJLElBQUksRUFBRTtnQkFDbkMsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO29CQUN4RCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLG1CQUFtQixFQUFFLENBQUM7b0JBQzdDLElBQUksQ0FBQyxNQUFNLENBQ1AsV0FBVyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUM7eUJBQ2hFLElBQUksQ0FBQyxZQUFZLENBQUM7eUJBQ2xCLEtBQUssQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQzt5QkFDMUIsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7d0JBQ1YsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFOzRCQUNwQixJQUFJLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO2dDQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs2QkFDMUI7aUNBQU07Z0NBQ0gsTUFBTSxDQUFDLDREQUE0RCxDQUFDLENBQUM7NkJBQ3hFO3lCQUNKO29CQUNMLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO3dCQUNiLE9BQU8sQ0FBQyxLQUFLLENBQUMsK0NBQStDLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBQ3BFLE1BQU0sQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO29CQUM3RCxDQUFDLENBQUMsQ0FBQztnQkFDWCxDQUFDLENBQUMsQ0FBQzthQUNOO1lBRUQsT0FBTyxJQUFJLENBQUMsb0JBQW9CLENBQUM7UUFDckMsQ0FBQztLQUFBO0lBRU0sU0FBUyxDQUFDLE1BQWM7UUFDM0IsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUk7WUFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7O1lBRXJCLE1BQU0sSUFBSSx5REFBMkIsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1FBRWpGLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRDs7Ozs7Ozs7T0FRRztJQUNJLEtBQUssQ0FBQyxHQUFXO1FBQ3BCLElBQUksSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJO1lBQ2hCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBRW5CLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxLQUFLO1FBQ1IsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ3BCLENBQUM7SUFFTSxZQUFZO1FBQ2YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQzFCLENBQUM7SUFFWSxZQUFZOztZQUNyQixNQUFNLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUU1QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDdEIsQ0FBQztLQUFBO0lBRVksY0FBYzs7WUFDdkIsTUFBTSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFFNUIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO2dCQUN4QixPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNyQixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7S0FBQTtJQUVNLGtCQUFrQjtRQUNyQixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7SUFDL0IsQ0FBQztJQUVNLG9CQUFvQjtRQUN2QixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDakMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDckIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU0sTUFBTTtRQUVULElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVuQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFdEMsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUMsY0FBYyxDQUFDO1FBQzFDLElBQUksQ0FBQyxXQUFXLEdBQUcsbUJBQW1CLENBQUMsS0FBSyxDQUFDO1FBQzdDLElBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDO0lBRTdCLENBQUM7O0FBbmRMLGdDQXFkQztBQW5kaUIseUJBQWMsR0FBRyxPQUFPLENBQUM7QUFFekIsMEJBQWUsR0FBRyxtQkFBbUIsQ0FBQztBQUV0QywyQkFBZ0IsR0FBRyxvQkFBb0IsQ0FBQztBQUV4Qyw4QkFBbUIsR0FBRyxJQUFJLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBK2NoRSxJQUFZLG1CQU1YO0FBTkQsV0FBWSxtQkFBbUI7SUFDM0IsK0RBQVMsQ0FBQTtJQUNULGlFQUFVLENBQUE7SUFDViwrREFBUyxDQUFBO0lBQ1Qsc0VBQWEsQ0FBQTtJQUNiLG1FQUFZLENBQUE7QUFDaEIsQ0FBQyxFQU5XLG1CQUFtQixHQUFuQiwyQkFBbUIsS0FBbkIsMkJBQW1CLFFBTTlCIn0=