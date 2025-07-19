import { PromotionStatusesInterface } from "./IPromotionStatuses";

export interface PromotionsInterface {
    ID?: number;
    PromotionCode?: string;
    PromotionName?: string;
    DiscountPercentage?:  number;
    ValidFrom?:     string;
    ValidUntil?:    string;
    minimum_price?: number;
    promotionStatusID?: number;
}

export interface PromotionsInterfaceG {
    ID?: number;
    PromotionCode?: string;
    PromotionName?: string;
    DiscountPercentage?:  number;
    ValidFrom?:     string;
    ValidUntil?:    string;
    MinimumPrice?: number;
    PromotionStatus?: PromotionStatusesInterface;
}