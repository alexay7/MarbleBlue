import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {GekiGameEventType} from "../types/gameevent.types.ts";

const gekiGameEventSchema = new Schema<GekiGameEventType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	eventId: {type: SchemaTypes.BigInt, required: true, unique: true},
	eventName: {type: String, required: true},
	eventType: {type: String, required: true},
	active: {type: Boolean, default: true},

	chapterId: {type: SchemaTypes.BigInt},
	chapterName: {type: String},
	songs: {type: [Number]},
});

export const GekiGameEvent = mongoose.model<GekiGameEventType>("GekiGameEvent", gekiGameEventSchema);