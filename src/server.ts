import { createServer } from 'http';
import { default as express } from 'express';
import { AuriaServer } from './AuriaServer.js';


//Object.defineProperty(exports, "__esModule", { value: true });


//var privateKey = fs.readFileSync('F:\\Apache24\\conf\\ssl\\server.key', 'utf8');
//var certificate = fs.readFileSync('F:\\Apache24\\conf\\ssl\\server.crt', 'utf8');

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
