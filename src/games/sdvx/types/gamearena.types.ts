import {Types} from "mongoose";

type SdvxGameArenaItemType = {
    catalogId:string;
    catalogType:string;
    price:number;
    itemType:string;
    itemId:string;
    param:string;
}

export type SdvxGameArenaType = {
    _id: Types.ObjectId;

    id:number;
    // rule: 0 score, 1 point, 2 vote
    rule:string;
    // rankMatchTarget: 0 arena, 1 single, 2 mega
    rankMatchTarget:string;

    catalog: SdvxGameArenaItemType[];
}