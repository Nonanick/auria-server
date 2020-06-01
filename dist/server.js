import { createServer } from 'http';
import * as fs from 'fs';
import { default as express } from 'express';
import { AuriaServer } from './AuriaServer.js';


//Object.defineProperty(exports, "__esModule", { value: true });


var privateKey = fs.readFileSync('F:\\Apache24\\conf\\ssl\\server.key', 'utf8');
var certificate = fs.readFileSync('F:\\Apache24\\conf\\ssl\\server.crt', 'utf8');

//var credentials = {key: privateKey, cert: certificate, rejectUnauthorized : false};


var app = express();

/*app.use(cors({
    "origin" : "http://app.paper.com",
    credentials: true,
    exposedHeaders : ["X-Auria-Access-Token","Set-Cookie"]
}));*/

var server = new AuriaServer(app);
server.run();

var sslServer = createServer({}, app);

sslServer.listen(8443);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc2VydmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0RBQThCO0FBQzlCLGlEQUFnRDtBQUVoRCxJQUFJLEdBQUcsR0FBRyxpQkFBTyxFQUFFLENBQUM7QUFDcEIsSUFBSSxNQUFNLEdBQUcsSUFBSSx5QkFBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2xDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyJ9