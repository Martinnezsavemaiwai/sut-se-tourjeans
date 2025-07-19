import { SlipsInterface } from "./ISlips";

export interface PaymentsInterface {
    ID?:    number;
    PaymentDate?: string;
    Amount?:    number;
    Note?:      string
    BookingID?: number;
    PaymentStatusID?:   number;
    SalesReportID?: number;
    EmployeeID?:    number;
    Slip?:  SlipsInterface;
}