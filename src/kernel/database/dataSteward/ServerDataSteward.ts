import { DataSteward } from "aurialib2";
import { ResourceManager } from "../../resource/ResourceManager.js";

export class ServerDataSteward extends DataSteward {

    protected resourceManager: ResourceManager;
    
    constructor(resourceManager: ResourceManager) {
        super();

        this.resourceManager = resourceManager;

    }

}