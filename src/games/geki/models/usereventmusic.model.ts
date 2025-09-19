import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {GekiUserEventMusicType} from "../types/usereventmusic.types.ts";

const gekiUserEventMusicSchema = new Schema<GekiUserEventMusicType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	eventId: {type: SchemaTypes.BigInt},
	type: {type: Number},
	musicId: {type: Number},
	level: {type: Number},
	techScoreMax: {type: Number, default: 0},
	platinumScoreMax: {type: Number, default: 0},
	techRecordDate: {type: Date, default: null},
	isTechNewRecord: {type: Boolean, default: false},
});

gekiUserEventMusicSchema.index({userId: 1}, {unique: false});
gekiUserEventMusicSchema.index({userId: 1, eventId: 1, type: 1, musicId: 1, level: 1}, {unique: true});

export const GekiUserEventMusic = mongoose.model<GekiUserEventMusicType>("GekiUserEventMusic", gekiUserEventMusicSchema);
