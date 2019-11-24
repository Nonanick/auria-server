"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = __importStar(require("bcrypt"));
const UserRole_1 = require("./UserRole");
const AuriaServer_1 = require("../../AuriaServer");
const aurialib2_1 = require("aurialib2");
const DataPermission_1 = require("./permission/DataPermission");
const jwt = __importStar(require("jsonwebtoken"));
const Auth_1 = require("../../config/Auth");
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
        this.loginTime = Date.now();
        this.ip = request.getIp();
        this.userAgent = request.getUserAgent();
    }
    buildUser() {
        this.buildUserRoles()
            .then(([userHiredRoles, userAccessRoles]) => {
            console.log("[SystemUser] User loggd in and have this roles:", userHiredRoles, "\nBut also hav access to this roles:", userAccessRoles);
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
                return conn.query("SELECT \
                    user_roles._id as hire_id, user_roles.role_id, user_roles.description as hire_description, \
                    role.name, role.title as role_title, role.description as role_description, role.icon \
                    FROM user_roles \
                    LEFT JOIN role \
                    ON role._id = user_roles.role_id  \
                    WHERE username=? ", [this.username]);
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
            return conn.query(accessRolesQuery, [rolesId]);
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
                    conn.query("SELECT \
                    firstname, lastname, treatment, phone, birth, avatar \
                    FROM users_info \
                    WHERE user_id=?", [this._id])
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
    getHandshakeToken(renew) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.handshakeToken == null || renew === true) {
                this.handshakeToken = yield this.renewToken();
            }
            return this.handshakeToken;
        });
    }
    getTransactionToken(renew) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.transactionToken == null || renew === true) {
                this.transactionToken = yield this.renewToken();
            }
            return this.transactionToken;
        });
    }
    generateTokenPayload() {
        return {
            username: this.username,
            userAgent: this.userAgent,
            ip: this.ip,
            loginTime: this.loginTime,
        };
    }
    /**
     * Generate a new toke based on the user info
     *
     * @param randomSalt User random salt to generate the token
     */
    renewToken(randomSalt) {
        let tokenHash = 
        // Make sure its the same user    
        this.username +
            // Validate "same origin"
            this.ip + this.userAgent;
        // Validate "same server session"
        this.system.getSystemVersion();
        // Use a random salt
        if (randomSalt === true && AuriaServer_1.Auria_ENV != "development") {
            this.randomSalt = Math.random() * 10000;
            tokenHash += randomSalt;
        }
        let promise = new Promise((resolve, reject) => {
            bcrypt.hash(tokenHash, 10).then((hash) => {
                resolve(hash);
            }).catch((error) => {
                console.error("[SystemUser] Failed to create token!", error);
                reject("[SystemUser] Failed to renew hash");
            });
        });
        return promise;
    }
    setSystem(system) {
        this.system = system;
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
    validateHandshake(request, handshake) {
        return __awaiter(this, void 0, void 0, function* () {
            let payload = jwt.verify(handshake, Auth_1.AuthConfig.jwtSecret);
            if (request.getUserAgent() == payload.userAgent
                && request.getIp() == payload.ip
                && payload.loginTime + 1000 * 60 * 60 * 24 * 2 > Date.now()) {
                return true;
            }
            console.log("[SystemUser] Invalid payload!", payload);
            return false;
        });
    }
    /**
     * Login with Password
     * --------------------
     *
     * Tries to login this user using the provided username
     * + password, if this succeeds this user will no longer be
     * a "guest" and will be able to access the system as a logged
     * user
     *
     * @param username
     * @param password
     */
    loginWithPassword(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let promise = Promise.resolve()
                .then(() => {
                let conn = this.system.getSystemConnection();
                return conn.query("SELECT _id, password, user_type FROM users WHERE username=?", [username]);
            })
                .then((results) => __awaiter(this, void 0, void 0, function* () {
                if (results.length === 1) {
                    let u = results[0];
                    let success = yield bcrypt.compare(password, u.password);
                    if (success) {
                        // # - Add User to System
                        this.username = username;
                        this.setAccessLevel(u.user_type);
                        this.setId(u._id);
                        this.system.addUser(this);
                        return true;
                    }
                    else {
                        console.log("Failed to authenticate user " + username + " hash should be: ");
                        bcrypt.hash(password, 10, (err, hash) => {
                            console.log("Gen Hash: ", hash);
                        });
                        return false;
                    }
                }
                else {
                    throw new Error("[Login] Failed to pinpoint user in the database!");
                }
            }));
            promise.catch((err) => {
                console.error("[Login] Failed to search for the user in the database!\n" + err);
            });
            return promise;
        });
    }
    loginWithPayload(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (payload.userAgent == this.userAgent && payload.ip == this.ip) {
                this.loginTime = payload.loginTime;
                this.username = payload.username;
                return Promise.resolve()
                    .then(_ => {
                    return this.system.getSystemConnection()
                        .query("SELECT _id, user_type FROM users WHERE username=?", [this.username]);
                })
                    .then(res => {
                    if (res.length != 1)
                        throw new Error("Failed to locate user in database");
                    return res[0];
                })
                    .then(user => {
                    this.setAccessLevel(user['user_type'])
                        .setId(user['_id']);
                    this.system.addUser(this);
                    return true;
                });
            }
            else {
                throw new Error("[SystemUser] Invalid payload, cannot login user!");
            }
        });
    }
    verifyLoginPayload(payload) {
        if (this.username === payload.username
            && this.userAgent === payload.userAgent
            && this.ip === payload.ip) {
            if (payload.loginTime + SystemUser.SESSION_EXPIRE_TIME < Date.now()) {
                console.error("[SystemUser] Session expired!");
                return false;
            }
            return true;
        }
        else {
            console.error("[SystemUser] Invalid payload, does not match with logged user", payload);
            return false;
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3lzdGVtVXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9rZXJuZWwvc2VjdXJpdHkvU3lzdGVtVXNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUdBLCtDQUFpQztBQUNqQyx5Q0FBc0M7QUFDdEMsbURBQThDO0FBQzlDLHlDQUFpQztBQUNqQyxnRUFBNkQ7QUFDN0Qsa0RBQW9DO0FBQ3BDLDRDQUErQztBQUUvQyxNQUFhLFVBQVcsU0FBUSxnQkFBSTtJQThJaEMsWUFBWSxNQUFjLEVBQUUsUUFBZ0I7UUFDeEMsS0FBSyxFQUFFLENBQUM7UUF0SVo7Ozs7O1dBS0c7UUFDTyxhQUFRLEdBQVcsT0FBTyxDQUFDO1FBVXJDOzs7OztXQUtHO1FBQ08sZ0JBQVcsR0FBVyxtQkFBbUIsQ0FBQyxLQUFLLENBQUM7UUFrSHRELElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBRXJCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNoQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7SUFFN0IsQ0FBQztJQUVNLFlBQVk7UUFDZixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDMUIsQ0FBQztJQUVNLFlBQVksQ0FBQyxLQUFlO1FBQy9CLElBQUksSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN6RCxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztTQUMxQjthQUFNO1lBQ0gsT0FBTyxDQUFDLEtBQUssQ0FBQyxpRUFBaUUsQ0FBQyxD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