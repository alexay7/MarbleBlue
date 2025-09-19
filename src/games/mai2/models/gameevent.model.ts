import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Mai2GameEventType} from "../types/gameevent.types.ts";

const mai2GameEventSchema = new Schema<Mai2GameEventType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	id: {type: SchemaTypes.BigInt, required: true, unique: true},
	type: {type: Number},
	startDate: {type: Date},
	endDate: {type: Date},
	enable: {type: Boolean},
	disableArea: {type: String}
});


export const Mai2GameEventModel = mongoose.model<Mai2GameEventType>("Mai2GameEvent", mai2GameEventSchema);
