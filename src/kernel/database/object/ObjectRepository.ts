import { System } from "../../System";
import { RowModel } from "../structure/rowModel/RowModel";
import { RowObject } from "../structure/rowModel/RowObject";
import { Table } from "../structure/table/Table";
import { QueryFilter } from "../dataQuery/QueryFilter";

export class ObjectRepository {

    protected objects: [];
    protected system: System;
    protected objectTable: Table;

    constructor(system: System) {

        this.objects = [];
        this.system = system;

        this.objectTable = new Table(system, "Auria.Object");
        //@todo load table info!
        this.objectTable.table = "object";

    }

    public async getObjectEquivalent(rowModel: RowModel): Promise<RowObject> {

        let promise: Promise<RowObject> = new Promise<RowObject>(
            (resolve, reject) => {
                let query = this.objectTable.newQuery();
           
                query.addFilters(false, 
                    new QueryFilter().set("table", "=", rowModel.getTable().getName()),
                    new QueryFilter().set("table_id", "=", rowModel.getId()),
                    new QueryFilter().set("pk_field", "=", rowModel.getTable().distinctiveColumn)
                );
                query.fetch()
                .then((res: any[]) => {
                    switch (res.length) {
                        // # - No object found!
                        case 0:
                            let nObj = this.createObjectToRowModel(rowModel);
                            resolve(nObj);
                            break;
                            
                        // # - Object found
                        case 1:
                            let obj = new RowObject(rowModel,res[0]["_id"]);
                            obj.setInfo(res[0]);
                            resolve(obj);
                            break;
                        // # - Shouldn't be more than one object per row
                        default:
                            reject("[ObjectRepository] Failed to pinpoint object from row model! Length: " + res.length);
                    }


                }).catch((err) => {
                    reject(err);
                });
            }
        );
        return promise;
    }

    public createObjectToRowModel(rowModel: RowModel) {

        let nObj = new RowObject(rowModel);
        
        nObj.setInfo({
            active: 1,
            current_version: 1,
            lock_time: 0,
            lock_user: 0,
            next_version: 2,
            owner: 0,
            owner_role: 0,
            pk_field: rowModel.getTable().distinctiveColumn,
            table: rowModel.getTable().getName(),
            table_id: rowModel.getId(),
            created_at : Date.now(),
            updated_at : Date.now(),
            deleted_at : undefined
        });

        nObj.save();

        return nObj;
    }


}