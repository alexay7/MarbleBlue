import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Chu3GameChargeType} from "../types/gamecharge.types.ts";

const Chu3GameChargeSchema = new Schema<Chu3GameChargeType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	chargeId: {type: Number},
	price: {type: Number},
	salePrice: {type: Number},
});

export const Chu3GameCharge = mongoose.model<Chu3GameChargeType>("Chu3GameCharge", Chu3GameChargeSchema);