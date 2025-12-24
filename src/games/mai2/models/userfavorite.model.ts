import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Mai2UserFavoriteType} from "../types/userfavorite.types.ts";

const mai2UserFavoriteSchema = new Schema<Mai2UserFavoriteType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	itemKind: {type: Number, required: true},
	itemIdList: {type: [Number], default: []},
});

mai2UserFavoriteSchema.index({userId: 1, itemKind: 1}, {unique: true});

export const Mai2UserFavoriteModel = mongoose.model<Mai2UserFavoriteType>("Mai2UserFavorite", mai2UserFavoriteSchema);