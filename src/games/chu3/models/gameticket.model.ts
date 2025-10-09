import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Chu3GameTicketType} from "../types/gameticket.types.ts";

const Chu3GameTicketSchema = new Schema<Chu3GameTicketType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	id: {type: Number, required: true, unique: true},
	name: {type: String, required: true},
	description: {type: String, required: true},
});

export const Chu3GameTicket = mongoose.model<Chu3GameTicketType>("Chu3GameTicket", Chu3GameTicketSchema);