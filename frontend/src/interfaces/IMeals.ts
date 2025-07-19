import { AccommodationsInterface } from './IAccommodations';
import { MealImagesInterface } from './IMealImages';
import { MealsTypesInterface } from "./IMealTypes";

export interface MealsInterface {
    ID?: number;
    MenusDetail?: string;
    MealType?: MealsTypesInterface
    AccommodationsInterface?: AccommodationsInterface;
    AccommodationID?: number;
    MealTypeID?: number;
    MealImagesInterface: MealImagesInterface[]
}