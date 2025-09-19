import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {GekiUserTrainingRoomType} from "../types/usertrainingroom.types.ts";

const gekiUserTrainingRoomSchema = new Schema<GekiUserTrainingRoomType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	authKey: {type: String, required: true},
	roomId: {type: Number, required: true},
	cardId: {type: Number, required: true},
	valueDate: {type: Date, required: true},
});

gekiUserTrainingRoomSchema.index({userId: 1}, {unique: false});
gekiUserTrainingRoomSchema.index({userId: 1, roomId: 1}, {unique: true});

export const GekiUserTrainingRoom = mongoose.model<GekiUserTrainingRoomType>("GekiUserTrainingRoom", gekiUserTrainingRoomSchema);