import { DataType } from "./DataType";
import { Toggle } from "./types/Toggle";
import { NumericIdentifier } from "./types/NumericIdentifier";
import { RowName } from "./types/RowName";
import { PositiveInteger } from "./types/PositiveInteger";
import { TableSourceType } from "./types/TableSource";
import { I18nText } from "./types/I18nText";
import { RowTitle } from "./types/RowTitle";
import { RowDescription } from "./types/RowDescription";
import { Integer } from "./types/Integer";
import { String } from "./types/String";
import { Number } from "./types/Number";
import { WhereFilter } from "./types/WhereFilter";
import { ReferenceText} from "./types/ReferenceText";
import { RelatedTo } from "./types/RelatedTo";
import { Icon } from "./types/Icon";
import { EncryptedText } from "./types/EncryptedText";
import { Color } from "./types/Color";
import { Boolean } from "./types/Boolean";
import { Timestamp } from "./types/Timestamp";

export var DataTypeRepository : { [dataTypeName: string]: DataType } = {
    "Toggle": new Toggle(),
    "NumericIdentifier": new NumericIdentifier(),
    "RowName": new RowName(),
    "PositiveInteger": new PositiveInteger(),
    "TableSource": new TableSourceType(),
    "I18nText": new I18nText(),
    "RowTitle": new RowTitle(),
    "RowDescription": new RowDescription(),
    "Integer": new Integer(),
    "String": new String(),
    "Number": new Number(),
    "WhereFilter": new WhereFilter(),
    "ReferenceText": new ReferenceText(),
    "RelatedTo": new RelatedTo(),
    "Icon": new Icon(),
    "EncryptedText": new EncryptedText(),
    "Color": new Color(),
    "Boolean" : new Boolean(),
    "Timestamp" : new Timestamp()
};
