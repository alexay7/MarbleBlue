import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Chu3GameChatSymbolType} from "../types/gamechatsymbol.types.ts";

const Chu3GameChatSymbolSchema = new Schema<Chu3GameChatSymbolType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	id: {type: Number, required: true, unique: true},
	name: {type: String, required: true},
	sortName: {type: String},
	description: {type: String},
	bubbleId: {type: Number},
	scenes: {type: [Number], default: []},
});

export const Chu3GameChatSymbol = mongoose.model<Chu3GameChatSymbolType>("Chu3GameChatSymbol", Chu3GameChatSymbolSchema);