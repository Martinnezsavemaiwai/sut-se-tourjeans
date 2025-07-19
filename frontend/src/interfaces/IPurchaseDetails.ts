import { TravelInsurancesInterface } from "./ITravelInsurances";

export interface PurchaseDetailsInterface {
    ID?:    number;
    Quantity?:  number;
    TotalPrice?:    number;
    BookingID?: number;
    TravelInsuranceID?: number;
    TravelInsurance?: TravelInsurancesInterface;
}