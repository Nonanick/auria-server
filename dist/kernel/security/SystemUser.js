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
const events_1 = require("events");
const DataPermission_1 = require("./permission/DataPermission");
const jwt = __importStar(require("jsonwebtoken"));
const Auth_1 = require("../../config/Auth");
class SystemUser extends events_1.EventEmitter {
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
            return Promise.resolve().then(_ => {
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
    buildUserAcessibleRowsFromQuery(queryResult) {
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
                    .then(this.buildUserAcessibleRowsFromQuery.bind(this));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3lzdGVtVXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9rZXJuZWwvc2VjdXJpdHkvU3lzdGVtVXNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUdBLCtDQUFpQztBQUNqQyx5Q0FBc0M7QUFDdEMsbURBQThDO0FBQzlDLG1DQUFzQztBQUN0QyxnRUFBNkQ7QUFDN0Qsa0RBQW9DO0FBQ3BDLDRDQUErQztBQUcvQyxNQUFhLFVBQVcsU0FBUSxxQkFBWTtJQThJeEMsWUFBWSxNQUFjLEVBQUUsUUFBZ0I7UUFDeEMsS0FBSyxFQUFFLENBQUM7UUF0SVo7Ozs7O1dBS0c7UUFDTyxhQUFRLEdBQVcsT0FBTyxDQUFDO1FBVXJDOzs7OztXQUtHO1FBQ08sZ0JBQVcsR0FBVyxtQkFBbUIsQ0FBQyxLQUFLLENBQUM7UUFrSHRELElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBRXJCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNoQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7SUFFN0IsQ0FBQztJQUVNLFlBQVk7UUFDZixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDMUIsQ0FBQztJQUVNLFlBQVksQ0FBQyxLQUFlO1FBQy9CLElBQUksSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN6RCxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztTQUMxQjthQUFNO1lBQ0gsT0FBTyxDQUFDLEtBQUssQ0FBQyxpRUFBaUUsQ0FBQyxD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