import { HotelImagesInterface } from './IHotelImages';
export interface HotelsInterface {
    ID?: number
    HotelName?: string
    HotelImagesInterface: HotelImagesInterface[]
}