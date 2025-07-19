import { ActivitiesInterface } from "./IActivities";
import { TourActivitiesGInterface } from "./ITourActivities"

export interface ScheduleActivities{
    ID?:    number;
    Time?:  string;
    Day?:   string;
    ActivityID?:    number;
    TourScheduleID?:    number;
    Activity?:  ActivitiesInterface;
}

export interface ScheduleActivitiesG{
    ID?:    number;
    Day?:   string;
    Time?:  string;
    ActivityID?:    number;
    TourScheduleID?:    number;
    Activity?:  TourActivitiesGInterface;
}