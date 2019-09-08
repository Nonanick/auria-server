"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ModuleListener_1 = require("../../ModuleListener");
class TableListener extends ModuleListener_1.ModuleListener {
    constructor(module) {
        super(module, "Table");
        this.metadata = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let tables = req.requiredParam('tables');
            let tablesInfo = {};
            try {
                for (let a = 0; a < tables.length; a++) {
                    let tableObj = yield this.module.getTable(req.getUser(), tables[a]);
                    let info = {};
                    if (tableObj != null) {
                        //Table Info
                        info = tableObj.asJSON();
                        //Load columns Info
                        info.columns = [];
                        let cols = yield tableObj.getColumns();
                        cols.forEach((col) => {
                            info.columns.push(col.asJSON());
                        });
                        tablesInfo[tables[a]] = info;
                    }
                }
                ;
            }
            catch (error) {
                throw new Error("[Table] Failed to fetch table info! " + error);
            }
            res.addToResponse({ tables: tablesInfo });
            res.send();
        });
    }
    getRequiredRequestHandlers() {
        return [];
    }
    getExposedActionsDefinition() {
        return {
            "metadata": {}
        };
    }
}
exports.TableListener = TableListener;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGFibGVMaXN0ZW5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9rZXJuZWwvbW9kdWxlL1N5c3RlbU1vZHVsZS9saXN0ZW5lcnMvVGFibGVMaXN0ZW5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEseURBQWlHO0FBS2pHLE1BQWEsYUFBYyxTQUFRLCtCQUFjO0lBTzdDLFlBQVksTUFBYztRQUN0QixLQUFLLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBU3BCLGFBQVEsR0FBbUIsQ0FBTyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7WUFFakQsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQWEsQ0FBQztZQUNyRCxJQUFJLFVBQVUsR0FBUSxFQUFFLENBQUM7WUFFekIsSUFBSTtnQkFDQSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFFcEMsSUFBSSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3BFLElBQUksSUFBSSxHQUFRLEVBQUUsQ0FBQztvQkFFbkIsSUFBSSxRQUFRLElBQUksSUFBSSxFQUFFO3dCQUNsQixZQUFZO3dCQUNaLElBQUksR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7d0JBQ3pCLG1CQUFtQjt3QkFDbkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7d0JBQ2xCLElBQUksSUFBSSxHQUFHLE1BQU0sUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDO3dCQUN2QyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBVyxFQUFFLEVBQUU7NEJBQ3pCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO3dCQUNwQyxDQUFDLENBQUMsQ0FBQzt3QkFDSCxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO3FCQUNoQztpQkFDSjtnQkFBQSxDQUFDO2FBQ0w7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDWixNQUFNLElBQUksS0FBSyxDQUFDLHNDQUFzQyxHQUFHLEtBQUssQ0FBQyxDQUFDO2FBQ25FO1lBQ0QsR0FBRyxDQUFDLGFBQWEsQ0FBQyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDO1lBQzFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNmLENBQUMsQ0FBQSxDQUFDO0lBcENGLENBQUM7SUFQTSwwQkFBMEI7UUFDN0IsT0FBTyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBT00sMkJBQTJCO1FBQzlCLE9BQU87WUFDSCxVQUFVLEVBQUUsRUFBRTtTQUNqQixDQUFDO0lBQ04sQ0FBQztDQWdDSjtBQS9DRCxzQ0ErQ0MifQ==