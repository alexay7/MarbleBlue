import type {SdvxUserVariantGateType} from "../types/uservariantgate.types.ts";
import mongoose, {Schema, SchemaTypes} from "mongoose";

const sdvxUserVariantGateSchema = new Schema<SdvxUserVariantGateType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	cardId: {type: String, required: true},
	version: {type: Number, required: true},

	power: {type: Number},
	overRadar: {type: String},
	element: {
		notes: {type: Number},
		peak: {type: Number},
		tsumami: {type: Number},
		tricky: {type: Number},
		onehand: {type: Number},
		handtrip: {type: Number},
	}
});

sdvxUserVariantGateSchema.index({cardId:1, version:1});

export const SdvxUserVariantGateModel =  mongoose.model<SdvxUserVariantGateType>("SdvxUserVariantGate", sdvxUserVariantGateSchema);