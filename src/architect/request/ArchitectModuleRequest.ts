import { ModuleRequest } from "../../kernel/http/request/ModuleRequest.js";
import { ResourceManager } from "../../kernel/resource/ResourceManager.js";
import Knex from "knex";

export interface ArchitectModuleRequest extends ModuleRequest {
    resourceManager : ResourceManager;
    connection : Knex;
}
