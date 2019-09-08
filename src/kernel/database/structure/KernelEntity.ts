import { System } from "../../System";
import { Collection } from "aurialib2";

export abstract class KernelEntity extends Collection {

    protected system: System;

    constructor(system: System, name? : string) {
        super(name);
        this.system = system;
    }

    protected __createAction = () => {

    };

    protected __updateAction = () => {

    };

    public columnToFieldName(colName: string): string {

        let colNamePieces = colName.split('_');

        for (var a = 1; a < colNamePieces.length; a++) {
            colNamePieces[a] =
                colNamePieces[a].charAt(0).toLocaleUpperCase() +
                colNamePieces[a].substring(1);
        }

        let fieldName = colNamePieces.join('');

        return fieldName;
    }

    public abstract asJSON(): {
        [prop: string]: any
    };
}