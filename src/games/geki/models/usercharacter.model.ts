import mongoose, {Schema, SchemaTypes} from "mongoose";
import type { GekiUserCharacterType } from "../types/usercharacter.types";

const gekiUserCharacterSchema = new Schema<GekiUserCharacterType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	characterId: {type: Number},
	costumeId: {type: Number},
	attachmentId: {type: Number},
	playCount: {type: Number},
	intimateLevel: {type: Number},
	intimateCount: {type: Number},
	intimateCountRewarded: {type: Number},
	intimateCountDate: {type: Date},
	isNew: {type: Boolean},
});

gekiUserCharacterSchema.index({userId: 1}, {unique: false});
gekiUserCharacterSchema.index({userId: 1, characterId: 1}, {unique: true});

export const GekiUserCharacter = mongoose.model("GekiUserCharacter", gekiUserCharacterSchema);