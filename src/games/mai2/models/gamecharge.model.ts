import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Mai2GameChargeType} from "../types/gamecharge.types.ts";

const mai2GameChargeSchema = new Schema<Mai2GameChargeType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	id: {type: SchemaTypes.Number, required: true, unique: true},
	orderId: {type: SchemaTypes.Number},
	chargeId: {type: SchemaTypes.Number},
	price: {type: SchemaTypes.Number},
});

export const Mai2GameChargeModel = mongoose.model<Mai2GameChargeType>("Mai2GameCharge", mai2GameChargeSchema);