import mongoose, {Schema} from "mongoose";
import type {KeychipType} from "../types/keychip.types.ts";

const keychipSchema = new Schema<KeychipType>({
	serial: { type: String, required: true},
	registerDate: { type: Date, required: true, default: Date.now },
	lastLoginDate: { type: Date, required: false, default: null },
	userId: { type: Schema.Types.ObjectId, ref: "User", required: false, default: null },
	status: { type: String, enum: ["good", "banned"], required: true, default: "good" }
});

keychipSchema.index({serial: 1});

export const Keychip = mongoose.model("Keychip", keychipSchema);