import { PurchaseDetailsInterface } from "./IPurchaseDetails";

export interface InsuranceParticipantsInterface {
    ID?:    number;
    IdCardNumber?:  string;
    FirstName?:     string;
    LastName?:      string;
    Age?:   number;
    PhoneNumber?:   string;
    Detail?: string;
    PurchaseDetailID?:  number;
    PurchaseDetail?: PurchaseDetailsInterface;
}