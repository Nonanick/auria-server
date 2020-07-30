import { CreateTableBuilder } from "knex";

export const DefaultIdColumn = (builder: CreateTableBuilder) => {
    builder.string("_id").primary().notNullable().comment("Generated ID");
}
