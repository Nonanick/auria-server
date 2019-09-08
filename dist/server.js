"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var https = require('https');
var cors = require('cors');

var privateKey  = fs.readFileSync('C:\\Apache24\\conf\\ssl\\server.key', 'utf8');
var certificate = fs.readFileSync('C:\\Apache24\\conf\\ssl\\server.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};

var express_1 = __importDefault(require("express"));

var AuriaServer_1 = require("./AuriaServer");
var app = express_1.default();

app.use(cors({
    "origin" : "https://localhost",
    credentials: true,
    exposedHeaders : "*"
}));

var server = new AuriaServer_1.AuriaServer(app);
server.run();

var sslServer = https.createServer(credentials, app);

sslServer.listen(8443);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc2VydmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0RBQThCO0FBQzlCLGlEQUFnRDtBQUVoRCxJQUFJLEdBQUcsR0FBRyxpQkFBTyxFQUFFLENBQUM7QUFDcEIsSUFBSSxNQUFNLEdBQUcsSUFBSSx5QkFBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2xDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyJ9