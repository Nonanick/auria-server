import Knex, { CreateTableBuilder } from "knex";

export function DefaultTimestamps(builder: CreateTableBuilder, knex: Knex) {
    builder.timestamp("created_at").defaultTo(knex.raw('CURRENT_TIMESTAMP')).notNullable()
        .comment("Auria auto generated column that holds rows creation date/time");

    builder.timestamp("updated_at").defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')).notNullable()
        .comment("Auria auto generated column that holds rows last edit date/time");

    builder.timestamp("deleted_at").defaultTo(null).nullable()
        .comment("Auria auto generated column that holds rows deletion date/time");
}