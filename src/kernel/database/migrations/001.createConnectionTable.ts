import Knex from "knex";
import { DefaultIdColumn } from "../default/DefaultIdColumn";
import { DefaultTimestamps } from "../default/DefaultTimestamps";

export function up(knex : Knex) {
    knex.schema.createTable("Auria_Connection", (builder) => {
        DefaultIdColumn(builder);

        builder.string("name", 255).notNullable().unique();
        builder.string("title", 255).notNullable();
        builder.string("host", 255).notNullable();
        builder.integer("port").notNullable();
        builder.string("driver", 50).notNullable();
        builder.string("database", 255).notNullable();
        builder.string("username", 255).notNullable();
        builder.string("password", 255).notNullable();

        DefaultTimestamps(builder, knex);


    });
}

export function down(knex : Knex) {
    knex.schema.dropTable("Auria_Connection");
}

