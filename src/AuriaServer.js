"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AuriaServer = /** @class */ (function () {
    function AuriaServer(app) {
        this.port = 8080;
        this.app = app;
    }
    AuriaServer.prototype.run = function () {
        this.app.listen(this.port);
    };
    return AuriaServer;
}());
exports.AuriaServer = AuriaServer;
