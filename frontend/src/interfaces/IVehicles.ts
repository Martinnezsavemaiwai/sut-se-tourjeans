import { VehicleImagesInterface } from "./IVehicleImages";

export interface VehiclesInterface {
    ID?: number;
    VehicleName?: string;
    VehicleTypeID?: number;
    VehicleImagesInterface?: VehicleImagesInterface[];
}