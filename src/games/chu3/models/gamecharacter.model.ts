import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Chu3GameCharacterType} from "../types/gamecharacter.types.ts";

const Chu3GameCharacterchema = new Schema<Chu3GameCharacterType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	id: {type: Number, required: true, unique: true},
	name: {type: String, required: true},
	sortName: {type: String},
	series: {type: String},
	seriesId: {type: Number},
});

export const Chu3GameCharacter = mongoose.model<Chu3GameCharacterType>("Chu3GameCharacter", Chu3GameCharacterchema);