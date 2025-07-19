import { PersonTypesInterface } from "./IPersonTypes";
import { RoomTypesInterface } from "./IRoomTypes";

export interface TourPricesInterface {
    ID?:    number;
    Price?: number;
    TourPackageID?: number;
    PersonTypeID?:  number;
    RoomTypeID?:    number;
    PersonType?:    PersonTypesInterface;
    RoomType?:      RoomTypesInterface;
}