import Knex from "knex";
import { DefaultIdColumn } from "../default/DefaultIdColumn";
import { DefaultTimestamps } from "../default/DefaultTimestamps";

export const up = (knex : Knex) => {
    
    console.log("Running Migration!");

    return knex.schema.createTable("Auria_Column", (builder) => {
        DefaultIdColumn(builder);
        builder.string("name", 255).notNullable();
        builder.string("resource_id").notNullable();
        builder.string("column_name").notNullable();
        builder.string("name").notNullable();
        builder.string("title").notNullable();
        builder.string("description");
        DefaultTimestamps(builder, knex);

        builder.unique(["resource_id","column_name"]);

    });
}

export const down = (knex : Knex) => {
    return knex.schema.dropTable("Auria_column");
}

