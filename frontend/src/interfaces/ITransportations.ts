import { TourPackagesInterface } from "./ITourPackages";
import { LocationsInterface } from "./ILocations";
import { VehiclesInterface } from "./IVehicles";
import { VehicleImagesInterface } from "./IVehicleImages";

export interface TransportationsInterface {
    ID: number;              
    TourPackage: TourPackagesInterface;   
    TourPackageID: number;
    DepartureTime: string;   
    ArrivalTime: string;     
    Vehicle: VehiclesInterface;  
    VehicleID: number;
    Location: LocationsInterface; 
    LocationID: number;
    VehicleImage?: VehicleImagesInterface[];
}