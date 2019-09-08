"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const Attributes_1 = require("./Attributes");
class Model extends events_1.EventEmitter {
    constructor() {
        super();
        this.attributes = new Attributes_1.Attributes();
    }
    setAttribute(attrNameOrObject, triggerOrValue, trigger) {
        if (typeof attrNameOrObject === "string") {
            let nObj = {};
            nObj[attrNameOrObject] = triggerOrValue;
            return this.setAttribute(nObj, trigger);
        }
        else {
            trigger = triggerOrValue;
        }
        //Holds the old values
        let oldValues = {};
        for (var at in attrNameOrObject) {
            if (attrNameOrObject.hasOwnProperty(at)) {
                oldValues[at] = this.attributes.getAttribute(at);
            }
        }
        this.attributes.setAttribute(attrNameOrObject, trigger);
        if (trigger !== false) {
            this.emit("changed", { oldValues: oldValues, values: attrNameOrObject, newValues: attrNameOrObject });
        }
        return this;
    }
    getAttribute(attrName) {
        return this.attributes.getAttribute(attrName).getLastValue();
    }
    getAttributesName() {
        return this.attributes.allAttributesName();
    }
    asJSON() {
        return this.attributes.allAttributes();
    }
}
exports.Model = Model;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMva2VybmVsL21vZGVsL01vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQXNDO0FBQ3RDLDZDQUEwQztBQUsxQyxNQUFhLEtBQU0sU0FBUSxxQkFBWTtJQUtuQztRQUNJLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLHVCQUFVLEVBQUUsQ0FBQztJQUN2QyxDQUFDO0lBdUJELFlBQVksQ0FDUixnQkFBdUQsRUFDdkQsY0FBbUIsRUFDbkIsT0FBaUI7UUFHakIsSUFBSSxPQUFPLGdCQUFnQixLQUFLLFFBQVEsRUFBRTtZQUN0QyxJQUFJLElBQUksR0FBUSxFQUFFLENBQUM7WUFDbkIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsY0FBYyxDQUFDO1lBQ3hDLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDM0M7YUFDSTtZQUNELE9BQU8sR0FBRyxjQUFjLENBQUM7U0FDNUI7UUFFRCxzQkFBc0I7UUFDdEIsSUFBSSxTQUFTLEdBQVEsRUFBRSxDQUFDO1FBQ3hCLEtBQUssSUFBSSxFQUFFLElBQUksZ0JBQWdCLEVBQUU7WUFDN0IsSUFBSSxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLEVBQUU7Z0JBQ3JDLFNBQVMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUNwRDtTQUNKO1FBRUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFeEQsSUFBSSxPQUFPLEtBQUssS0FBSyxFQUFFO1lBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFLENBQUMsQ0FBQztTQUN6RztRQUVELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxZQUFZLENBQUMsUUFBZ0I7UUFDaEMsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUNqRSxDQUFDO0lBRU0saUJBQWlCO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQy9DLENBQUM7SUFFTSxNQUFNO1FBQ1QsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQzNDLENBQUM7Q0FDSjtBQTFFRCxzQkEwRUMifQ==