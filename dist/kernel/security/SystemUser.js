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
SystemUser.GUEST_USERNAME = "guest";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3lzdGVtVXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9rZXJuZWwvc2VjdXJpdHkvU3lzdGVtVXNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEseUNBQWlDO0FBR2pDLHlDQUFzQztBQUN0QyxtRkFBOEU7QUFDOUUsMkZBQXdGO0FBSXhGLE1BQWEsVUFBVyxTQUFRLGdCQUFJO0lBcUloQyxZQUFZLE1BQWMsRUFBRSxRQUFnQjtRQUN4QyxLQUFLLEVBQUUsQ0FBQztRQTFIWjs7Ozs7V0FLRztRQUNPLGFBQVEsR0FBVyxVQUFVLENBQUMsY0FBYyxDQUFDO1FBVXZEOzs7OztXQUtHO1FBQ08sZ0JBQVcsR0FBVyxtQkFBbUIsQ0FBQyxLQUFLLENBQUM7UUFzR3RELElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBRXJCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUVoQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7SUFFN0IsQ0FBQztJQUVNLFlBQVk7UUFDZixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDMUIsQ0FBQztJQUVNLFlBQVksQ0FBQyxLQUFlO1FBQy9CLElBQUksSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN6RCxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztTQUMxQjthQUFNO1lBQ0gsT0FBTyxDQUFDLEtBQUssQ0FBQyxpRUFBaUUsQ0FBQyxDQUFDO1NBQ3BGO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIs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