import { Request } from "express";
import {User as BAUser} from "better-auth";

declare global {
    namespace Express {
        export interface Request {
            currentUser?:BAUser,
            cardId?:string
        }
    }
}