import mongoose, {Schema} from "mongoose";
import type {CardType} from "../types/card.types.ts";

const cardSchema = new Schema<CardType>({
	extId: { type: String, required: true},
	accessCode: { type: String, required: true, unique: true },
	registerDate: { type: Date, required: true, default: Date.now },
	lastLoginDate: { type: Date, required: false, default: null },
	userId: { type: Schema.Types.ObjectId, ref: "User", required: false, default: null },
	status: { type: String, enum: ["good", "banned"], required: true, default: "good" },
	pin: { type: String, required: false },
});

cardSchema.index({userId: 1});

export const Card = mongoose.model("Card", cardSchema);