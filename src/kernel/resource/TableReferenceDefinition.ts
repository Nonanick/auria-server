export interface TableReferenceDefinition {
    columnName: string;
    tableName: string;
    onUpdate?: "CASCADE" | "RESTRICT";
    onDelete?: "CASCADE" | "RESTRICT";
}