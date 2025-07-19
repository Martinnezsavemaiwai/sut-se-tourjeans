import { BookingDetailsInterface } from "./IBookingDetails";
import { BookingStatusesInterface } from "./IBookingStatuses";
import { CancellationReasonsInterface } from "./ICancellationReasons";
import { CustomersInterface } from "./ICustomers";
import { PaymentsInterface } from "./IPayments";
import { PromotionsInterface } from "./IPromotions";
import { PurchaseDetailsInterface } from "./IPurchaseDetails";
import { TourSchedulesInterface } from "./ITourSchedules";

export interface BookingsInterface {
    ID?:                number;
    BookingDate?:       string;
    TotalPrice?:        number;
    TotalQuantity?:     number;
    SpecialRequest?:    string;
    CancellationReasonID?:    number;
    CustomerID?:        number;
    TourScheduleID?:    number;
    BookingStatusID?:   number;
    PromotionID?:       number;
    Promotion?:         PromotionsInterface;
    TourSchedule?:      TourSchedulesInterface;
    BookingDetails?:    BookingDetailsInterface[];
    PurchaseDetails?:   PurchaseDetailsInterface[];
    Payment?:           PaymentsInterface;
    Customer?:          CustomersInterface;
    BookingStatus?:     BookingStatusesInterface;
    CancellationReason?:    CancellationReasonsInterface;
}