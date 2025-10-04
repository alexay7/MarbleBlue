import {Types} from "mongoose";

export type UserType = {
    _id:Types.ObjectId;

    discordId:string;
    username:string;
    lastLogin:Date;
    createdAt:Date;
}