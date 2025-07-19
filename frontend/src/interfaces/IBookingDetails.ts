import { BookingsInterface } from "./IBookings";
import { TourPricesInterface } from "./ITourPrices";

export interface BookingDetailsInterface {
    ID?:    number;
    Quantity?:  number;
    TotalPrice?:    number;
    BookingID?: number;
    Booking?: BookingsInterface;
    TourPriceID?:  number;
    TourPrice?:     TourPricesInterface;
}