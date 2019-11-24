"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aurialib2_1 = require("aurialib2");
class KernelEntity extends aurialib2_1.Collection {
    constructor(system, name) {
        super(name);
        this.__createAction = () => {
        };
        this.__updateAction = () => {
        };
        this.system = system;
    }
    columnToFieldName(colName) {
        let colNamePieces = colName.split('_');
        for (var a = 1; a < colNamePieces.length; a++) {
            colNamePieces[a] =
                colNamePieces[a].charAt(0).toLocaleUpperCase() +
                    colNamePieces[a].substring(1);
        }
        let fieldName = colNamePieces.join('');
        return fieldName;
    }
}
exports.KernelEntity = KernelEntity;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiS2VybmVsRW50aXR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2tlcm5lbC9kYXRhYmFzZS9zdHJ1Y3R1cmUvS2VybmVsRW50aXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EseUNBQXVDO0FBRXZDLE1BQXNCLFlBQWEsU0FBUSxzQkFBVTtJQUlqRCxZQUFZLE1BQWMsRUFBRSxJQUFjO1FBQ3RDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUlOLG1CQUFjLEdBQUcsR0FBRyxFQUFFO1FBRWhDLENBQUMsQ0FBQztRQUVRLG1CQUFjLEdBQUcsR0FBRyxFQUFFO1FBRWhDLENBQUMsQ0FBQztRQVRFLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3pCLENBQUM7SUFVTSxpQkFBaUIsQ0FBQyxPQUFlO1FBRXBDLElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFdkMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDM0MsYUFBYSxDQUFDLENBQUMsQ0FBQztnQkFDWixhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFO29CQUM5QyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3JDO1FBRUQsSUFBSSxTQUFTLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUV2QyxPQUFPLFNBQVMsQ0FBQztJQUNyQixDQUFDO0NBS0o7QUFuQ0Qsb0NBbUNDIn0=