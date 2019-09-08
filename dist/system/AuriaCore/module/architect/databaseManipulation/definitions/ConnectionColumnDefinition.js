"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConnectionColumnDefinition {
    constructor(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
    setSQLType(sqlType, skipAutoSet = false) {
        this.sqlType = sqlType;
        let type = sqlType.toLocaleLowerCase();
        if (type.indexOf('(') >= 0 && !skipAutoSet) {
            this.sqlType = sqlType.slice(0, type.indexOf('('));
            let matches = type.match(/[(][^)]*\)/g);
            if (matches != null) {
                matches.forEach((number) => {
                    this.length = Number.parseInt(number.slice(1, -1));
                });
            }
        }
    }
    setExtra(extra) {
        this.extra = extra;
        return this;
    }
    setKey(key) {
        if (key.toLocaleUpperCase().indexOf("PRI") >= 0) {
            this.isPrimary = true;
        }
        return this;
    }
    asJson() {
        return {
            name: this.name,
            sqlType: this.sqlType,
            length: this.length,
            default: this.default,
            primary: this.isPrimary,
            null: this.null
        };
    }
}
exports.ConnectionColumnDefinition = ConnectionColumnDefinition;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29ubmVjdGlvbkNvbHVtbkRlZmluaXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvc3lzdGVtL0F1cmlhQ29yZS9tb2R1bGUvYXJjaGl0ZWN0L2RhdGFiYXNlTWFuaXB1bGF0aW9uL2RlZmluaXRpb25zL0Nvbm5lY3Rpb25Db2x1bW5EZWZpbml0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsTUFBYSwwQkFBMEI7SUFrQm5DLFlBQVksSUFBWTtRQUNwQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNyQixDQUFDO0lBRU0sT0FBTztRQUNWLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztJQUNyQixDQUFDO0lBRU0sVUFBVSxDQUFDLE9BQWdCLEVBQUUsV0FBVyxHQUFHLEtBQUs7UUFFbkQsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFFdkIsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFFdkMsSUFBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUN2QyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQVksQ0FBQztZQUU5RCxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3hDLElBQUcsT0FBTyxJQUFJLElBQUksRUFBQztnQkFDZixPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFDLEVBQUU7b0JBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZELENBQUMsQ0FBQyxDQUFDO2FBQ047U0FDSjtJQUNMLENBQUM7SUFFTSxRQUFRLENBQUMsS0FBYTtRQUN6QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRU0sTUFBTSxDQUFDLEdBQVc7UUFDckIsSUFBRyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzVDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1NBQ3pCO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVNLE1BQU07UUFDVCxPQUFPO1lBQ0gsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2YsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ3JCLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtZQUNuQixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87WUFDckIsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTO1lBQ3ZCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtTQUNsQixDQUFDO0lBQ04sQ0FBQztDQUNKO0FBbEVELGdFQWtFQyJ9