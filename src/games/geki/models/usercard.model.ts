import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {GekiUserCardType} from "../types/usercard.types.ts";

const gekiUserCardSchema = new Schema<GekiUserCardType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	cardId: {type: Number, required: true},
	digitalStock: {type: Number, default: 0},
	analogStock: {type: Number, default: 0},
	level: {type: Number, default: 1},
	maxLevel: {type: Number, default: 1},
	exp: {type: Number, default: 0},
	printCount: {type: Number, default: 0},
	useCount: {type: Number, default: 0},
	isNew: {type: Boolean, default: true},
	kaikaDate: {type: Date, default: null},
	choKaikaDate: {type: Date, default: null},
	skillId: {type: Number, default: 0},
	isAcquired: {type: Boolean, default: false},
	created: {type: Date, default: Date.now},
});

gekiUserCardSchema.index({userId: 1}, {unique: false});
gekiUserCardSchema.index({userId: 1, cardId: 1}, {unique: true});

export const GekiUserCard = mongoose.model("GekiUserCard", gekiUserCardSchema);