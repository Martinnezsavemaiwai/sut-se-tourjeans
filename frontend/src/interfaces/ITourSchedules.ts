import { TourPackagesInterface } from "./ITourPackages";

export interface TourSchedulesInterface{
    ID?:    number;
    StartDate?: string;
    EndDate?:   string;
    AvailableSlots?:    number;
    TourPackageID?:     number;
    TourScheduleStatusID?:  number;
    TourPackage?:   TourPackagesInterface;
}