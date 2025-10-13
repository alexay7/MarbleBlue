import {Types} from "mongoose";

export type Chu3GameChargeType = {
    _id: Types.ObjectId;

    orderId: number;
    chargeId: number;
    price: number;
    salePrice: number;
}