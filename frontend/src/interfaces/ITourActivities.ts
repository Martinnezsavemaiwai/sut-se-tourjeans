import { LocationsInterface } from "./ILocations";

export interface TourActivitiesInterface{
    ID?: number;
    ActivityName?: string;
    Description?: string;
    DateTime?: string;
}


export interface TourActivitiesGInterface{
    ID?: number;
    ActivityName?: string;
    Description?: string; 
    Location?: LocationsInterface;
}