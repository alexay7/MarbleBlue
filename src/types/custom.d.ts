import { Request } from "express";
import {Types} from "mongoose";

declare global {
    namespace Express {
        export interface Request {
            currentUser?:{
                _id:Types.ObjectId;
            },
            cardId?:string
        }
    }
}