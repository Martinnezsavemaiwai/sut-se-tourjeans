import { ProvidersInterface } from "./IProviders";

export interface TravelInsurancesInterface {
    ID?:    number;
    InsuranceName?: string;
    Price?: number;
    CoverageDetail?:    string;
    ProviderID?:    string;
    Provider?: ProvidersInterface;
}