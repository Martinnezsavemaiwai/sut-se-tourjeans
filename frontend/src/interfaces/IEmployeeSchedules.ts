export interface EmployeeSchedulesInterface {
    ID: number; // Primary key
    TourScheduleID: number; // Foreign key for TourSchedules
    EmployeeID: number; // Foreign key for Employees
}