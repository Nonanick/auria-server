import { ConnectionColumnDefinition } from "./ConnectionColumnDefinition";

export class ConnectionTableDefinition {

    /**
     * Name
     * -----
     * 
     */
    public name: string;

    /**
     * Columns
     * ---------
     * 
     */
    public columns: ConnectionColumnDefinition[] = [];



    constructor() {
    }


}