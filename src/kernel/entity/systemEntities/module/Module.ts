import { SystemEntity } from "../../SystemEntity";
import { DefaultIdColumn } from "../../defaultColumns/DefaultIdColumn";
import { DefaultNameColumn } from "../../defaultColumns/DefaultNameColumn";
import { DefaultTitleColumn } from "../../defaultColumns/DefaultTitleColumn";
import { DefaultStatusColumn } from "../../defaultColumns/DefaultStatusColumn";
import { DefaultDescriptionColumn } from "../../defaultColumns/DefaultDescriptionColumn";
import { ColorColumn } from "./columns/ColorColumn";
import { IconColumn } from "./columns/IconColumn";

export class Module extends SystemEntity {

    constructor() {
        super(ModuleSystemEntityName);

        this.addColumns(
            new DefaultIdColumn(),
            new DefaultNameColumn(),
            new DefaultTitleColumn(),
            new DefaultDescriptionColumn(),
            
            new ColorColumn(),
            new IconColumn(),
            

            new DefaultStatusColumn(),
        )
    }
}

export const ModuleSystemEntityName = "Auria_Module";