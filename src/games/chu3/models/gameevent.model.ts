import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Chu3GameEventType} from "../types/gameevent.types.ts";

const Chu3EventSchema = new Schema<Chu3GameEventType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	id: {type: SchemaTypes.BigInt, required: true, unique: true},
	type: {type: Number, required: true},
	name: {type: String, required: true},
	enabled: {type: Boolean, required: true},
});

export const Chu3GameEvent = mongoose.model<Chu3GameEventType>("Chu3Event", Chu3EventSchema);