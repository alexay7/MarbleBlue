import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Chu3UserCharacterType} from "../types/usercharacter.types.ts";

const chu3UserCharacterSchema = new Schema<Chu3UserCharacterType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	cardId: {type: String, ref: "Card", required: true},

	characterId: {type: Number},
	playCount: {type: Number},
	level: {type: Number},
	friendshipExp: {type: Number},
	isValid: {type: Boolean},
	isNewMark: {type: Boolean},
	exMaxLv: {type: Number},
	assignIllust: {type: Number},
	param1: {type: Number},
	param2: {type: Number},
});

chu3UserCharacterSchema.index({cardId: 1}, {unique:false});
chu3UserCharacterSchema.index({cardId: 1, characterId: 1}, {unique: true});

export const Chu3UserCharacter = mongoose.model("Chu3UserCharacter", chu3UserCharacterSchema);