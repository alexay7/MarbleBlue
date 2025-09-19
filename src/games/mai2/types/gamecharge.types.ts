import {Types} from "mongoose";

export type Mai2GameChargeType = {
    _id:Types.ObjectId;

    id: number;

    orderId: number;

    chargeId: number;

    price:number;
}