import { DefaultIdColumnDefinition } from "../defaultColumns/DefaultIdColumnDefinition.js";
import { DefaultNameColumnDefinition } from "../defaultColumns/DefaultNameColumnDefinition.js";
import { DefaultTitleColumnDefinition } from "../defaultColumns/DefaultTitleColumnDefinition.js";
import { ResourceIdReferenceColumnDefinition } from "../resource/ResourceIdReferenceColumn.js";
import { asResource } from "../../Resource.js";
import { SystemConnectionDefinition } from "../../../connection/SystemConnectionDefinition.js";

export const ColumnResourceDefinition = asResource({
    name : "Column",
    tableName : "Column",
    connection : SystemConnectionDefinition,
    title : "@{Auria.Resource.Column.Title}",
    description : "",
    columns : {
        ID : DefaultIdColumnDefinition,
        Name : DefaultNameColumnDefinition,
        Title : DefaultTitleColumnDefinition,
        ResourceId : ResourceIdReferenceColumnDefinition,
        ColumnName : {
            name : "Column Name",
            columnName : "column_name",
            sqlType : "VARCHAR",
            length : 255,
            nullable : false,
            index : true,
        }
    }

});