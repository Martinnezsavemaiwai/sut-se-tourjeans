export interface TourPackage {
  package_code: string;
  tour_name: string;
  intro: string;
  trip_highlights?: string;
  package_detail?: string;
  places_highlight?: string;
  duration?: string;
  tour_schedules: TourSchedules[];
  activities: Activity[];
  price: TourPrice[];
  tourImages?: string[];
}

export interface TourSchedules {
  start_date: string;
  end_date: string;
  available_slots: number;
}

export interface Activity {
  province: string;
  location: string;
  activity_name: string;
  description: string;
  time: string;
  day: string;
}

export interface TourPrice {
  price: number;
}



export interface UpdateTourPackageRequest {
  package_code: string;
  tour_name?: string;
  duration?: string;
  province_id?: number;

  intro?: string;
  package_detail?: string;
  trip_highlight?: string;
  places_highlight?: string;

  tour_images?: {
    file_path?: string;
  }[];

  tour_schedules?: {
    id?: number;
    start_date?: string;
    end_date?: string;
    available_slots?: number;
  }[];

  activities?: {
    id?: number;
    time?: string;
    day: string;
    activity_name?: string;
    description?: string;
    location_id?: number;
  }[];

  tour_prices?: {
    room_type_id: number;
    price?: number;
  }[];
}