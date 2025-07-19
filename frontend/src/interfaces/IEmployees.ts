import { RolesInterface } from "./IRoles";

export interface EmployeesInterface {
    ID: number;
    UserName: string;
    FirstName: string;
    LastName: string;
    Email: string;
    PhoneNumber: string;
    Role:RolesInterface
    RoleID: number;
    GenderID: number;
    ProfilePath?: string; 

}