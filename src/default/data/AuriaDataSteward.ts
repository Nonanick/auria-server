import { ServerDataSteward } from "../../kernel/database/dataSteward/ServerDataSteward.js";
import { ResourceManager } from "../../kernel/resource/ResourceManager.js";


export class AuriaDataSteward extends ServerDataSteward {

    constructor(resourceManager: ResourceManager) {
        super(resourceManager);

    }

}