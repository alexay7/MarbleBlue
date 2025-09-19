import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {GekiUserBossType} from "../types/userboss.types.ts";

const gekiUserBossSchema = new Schema<GekiUserBossType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	musicId: {type: Number},
	damage: {type: Number},
	isClear: {type: Boolean},
	eventId: {type: SchemaTypes.BigInt},
});

gekiUserBossSchema.index({userId: 1}, {unique: false});
gekiUserBossSchema.index({userId: 1, musicId: 1}, {unique: true});

export const GekiUserBoss = mongoose.model<GekiUserBossType>("GekiUserBoss", gekiUserBossSchema);