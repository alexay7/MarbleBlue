import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Chu3UserCharacterType} from "../types/usercharacter.types.ts";

const chu3UserCharacterSchema = new Schema<Chu3UserCharacterType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	cardId: {type: String, ref: "Card", required: true},

	characterId: {type: Number,required:true},
	playCount: {type: Number,default:0},
	level: {type: Number,default:1},
	friendshipExp: {type: Number,default:0},
	isValid: {type: Boolean,default:true},
	isNewMark: {type: Boolean,default:true},
	exMaxLv: {type: Number,default:0},
	assignIllust: {type: Number,required:true},
	param1: {type: Number,default:0},
	param2: {type: Number,default:0},
});

chu3UserCharacterSchema.index({cardId: 1}, {unique:false});
chu3UserCharacterSchema.index({cardId: 1, characterId: 1}, {unique: true});

export const Chu3UserCharacter = mongoose.model("Chu3UserCharacter", chu3UserCharacterSchema);