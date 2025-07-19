import { MealsInterface } from './IMeals';
import { MealImagesInterface } from './IMealImages';
import { HotelsInterface } from "./IHotels"
import { TourPackagesInterface } from './ITourPackages';

export interface AccommodationsInterface {
    ID?: number
    CheckInDate?: string
    CheckOutDate?: string
    HotelID?: number
    Hotel?: HotelsInterface;
    MealImagesInterface?:MealImagesInterface[]
    TourPackageID?: number
    TourPackage?: TourPackagesInterface
    Meals?: MealsInterface[];
}