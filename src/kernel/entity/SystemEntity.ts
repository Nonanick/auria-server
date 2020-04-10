import { Entity } from "aurialib2";
import Knex from "knex";
import { EntityColumn } from "./EntityColumn";
import { DatabaseConfig } from "../../config/Database";

export abstract class SystemEntity extends Entity {

    protected columns: Map<string, EntityColumn>;

    constructor(name: string) {
        super(name);
        this.columns = new Map();
    }

    public installSchema(conn: Knex) {
        let answer = conn.schema.hasTable(this.name).then((hasTable) => {
            if (!hasTable) {
                conn.schema.createTable(this.name, (builder) => {
                    this.buildTable(conn, builder);
                }).then((ok) => {
                    console.log("[SystemEntity] Created table " + this.name);
                }).catch((err) => {
                    console.error("[SystemEntity] Failed to create table! " + this.name, err);
                });
            }
        });

        answer.catch((err) => {
            console.error("[SystemEntity] Failed to check for table existence!", err);
        });

        return answer;

    }

    protected buildTable(conn: Knex, tableBuilder: Knex.CreateTableBuilder) {

        tableBuilder.charset(DatabaseConfig.charset);

        this.columns.forEach((column, name) => {
            column.buildSchema(tableBuilder);
        });

        // Adds "CreatedAt", "UpdatedAt" and "DeletedAt"
        tableBuilder.timestamp("created_at").defaultTo(conn.fn.now());
        tableBuilder.timestamp("updated_at").defaultTo(conn.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
        tableBuilder.timestamp("deleted_at").nullable();

        return [conn, tableBuilder];
    }

    public addColumn(column: EntityColumn) {
        this.columns.set(column.name, column);
    }

    public addColumns(...columns: EntityColumn[]) {
        for (let a = 0; a < columns.length; a++) {
            this.addColumn(columns[a]);
        }
    }
}