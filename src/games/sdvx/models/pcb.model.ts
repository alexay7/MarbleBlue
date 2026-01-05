import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {SdvxPcbType} from "../types/pcb.types.ts";

const sdvxPcbSchema = new Schema<SdvxPcbType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	pcbId: {type: String, required: true},
	userId: {type: SchemaTypes.ObjectId, required: false},

	enabledFlags: {type: [String], required: true},
	arenaSeason: {type: Number, required: true, default: 22},

	unlockMusic: {type: Boolean, default:true},
});

sdvxPcbSchema.index({pcbId: 1}, { unique: true });

export const SdvxPcbModel =  mongoose.model<SdvxPcbType>("SdvxPcb", sdvxPcbSchema);