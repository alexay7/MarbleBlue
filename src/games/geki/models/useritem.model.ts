import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {GekiUserItemType, GekiUserMusicItemType} from "../types/useritem.types.ts";

const gekiUserItemSchema = new Schema<GekiUserItemType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	itemKind: {type: Number, required: true},
	itemId: {type: Number, required: true},
	stock: {type: Number, default: 0},
	isValid: {type: Boolean, default: true},
});

gekiUserItemSchema.index({userId: 1}, {unique: false});
gekiUserItemSchema.index({userId: 1, itemKind: 1, itemId: 1}, {unique: true});

export const GekiUserItem = mongoose.model<GekiUserItemType>("GekiUserItem", gekiUserItemSchema);

const gekiUserMusicItemSchema = new Schema<GekiUserMusicItemType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	musicId: {type: Number, required: true},
	status: {type: Number, required: true},
});

gekiUserMusicItemSchema.index({userId: 1}, {unique: false});
gekiUserMusicItemSchema.index({userId: 1, musicId: 1}, {unique: true});

export const GekiUserMusicItem = mongoose.model<GekiUserMusicItemType>("GekiUserMusicItem", gekiUserMusicItemSchema);