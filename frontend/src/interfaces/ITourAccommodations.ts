import {HotelsInterface}  from "./IHotels";

export interface TourAccommodationsInterface {
    ID?: number;
    HotelID?: number;
    Hotel?: HotelsInterface; // เชื่อมกับข้อมูลโรงแรม
}