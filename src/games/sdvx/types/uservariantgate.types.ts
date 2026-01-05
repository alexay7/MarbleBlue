import type { Types } from "mongoose";

export type SdvxUserVariantGateType = {
    _id: Types.ObjectId;

    cardId: string;
    version: number;

    power: number;
    overRadar: string;
    element: {
        notes: number;
        peak: number;
        tsumami: number;
        tricky: number;
        onehand: number;
        handtrip: number;
    }
}