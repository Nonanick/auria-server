"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const aurialib2_1 = require("aurialib2").aurialib2;
const UserRole_1 = require("./UserRole");
const DataPermission_1 = require("./permission/DataPermission");
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
        this.username = "guest";
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
    }
    buildAccessPermission() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    buildDataPermission() {
        return __awaiter(this, void 0, void 0, function* () {
            this.dataPermission = new DataPermission_1.DataPermission(this);
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
            let accessRolesQuery = "\
        WITH RECURSIVE access_roles AS (\
            SELECT \
                role._id, \
                role.name, role.title, role.description, role.icon, \
                role.parent_role \
            FROM role \
            WHERE role.parent_role IS NULL AND role._id IN (?) \
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
            let rolesId = [];
            userRoles.forEach((val) => {
                if (val != null)
                    rolesId.push(val.getId());
            });
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
        this.username = "guest";
        this.accessLevel = SystemUserPrivilege.GUEST;
        this.canAccessRoles = [];
    }
}
SystemUser.COOKIE_USERNAME = "AURIA_UA_USERNAME";
SystemUser.COOKIE_HANDSHAKE = "AURIA_UA_HANDSHAKE";
SystemUser.SESSION_EXPIRE_TIME = 1000 * 60 * 60 * 24 * 2;
exports.SystemUser = SystemUser;
var SystemUserPrivilege;
(function (SystemUserPrivilege) {
    SystemUserPrivilege[SystemUserPrivilege["GUEST"] = 0] = "GUEST";
    SystemUserPrivilege[SystemUserPrivilege["NORMAL"] = 1] = "NORMAL";
    SystemUserPrivilege[SystemUserPrivilege["ADMIN"] = 5] = "ADMIN";
    SystemUserPrivilege[SystemUserPrivilege["SYSADMIN"] = 10] = "SYSADMIN";
    SystemUserPrivilege[SystemUserPrivilege["MASTER"] = 999] = "MASTER";
})(SystemUserPrivilege = exports.SystemUserPrivilege || (exports.SystemUserPrivilege = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3lzdGVtVXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9rZXJuZWwvc2VjdXJpdHkvU3lzdGVtVXNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEseUNBQWlDO0FBR2pDLHlDQUFzQztBQUN0QyxnRUFBNkQ7QUFFN0QsMkZBQXdGO0FBR3hGLE1BQWEsVUFBVyxTQUFRLGdCQUFJO0lBa0loQyxZQUFZLE1BQWMsRUFBRSxRQUFnQjtRQUN4QyxLQUFLLEVBQUUsQ0FBQztRQTFIWjs7Ozs7V0FLRztRQUNPLGFBQVEsR0FBVyxPQUFPLENBQUM7UUFVckM7Ozs7O1dBS0c7UUFDTyxnQkFBVyxHQUFXLG1CQUFtQixDQUFDLEtBQUssQ0FBQztRQXNHdEQsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFFckIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBRWhDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNoQixJQUFJLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQztJQUU3QixDQUFDO0lBRU0sWUFBWTtRQUNmLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUMxQixDQUFDO0lBRU0sWUFBWSxDQUFDLEtBQWU7UUFDL0IsSUFBSSxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3pELElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1NBQzFCO2FBQU07WUFDSCxPQUFPLENBQUMsS0FBSyxDQUFDLGlFQUFpRSxDQUFDLENBQUM7U0FDcEY7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0s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