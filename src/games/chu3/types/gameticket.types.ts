import {Types} from "mongoose";

export type Chu3GameTicketType = {
    _id: Types.ObjectId;

    id: number;
    name: string;
    description: string;
}