import { ConnectionDefinition } from "./Connection";


export const SystemConnectionDefinition: ConnectionDefinition = {
    name : "AuriaSystemMainConnection",
    driver: "mysql",
    database: "auria",
    host: "localhost",
    port: 3307,
    username: "root",
    password: ""
};