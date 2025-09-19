import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {GekiUserStoryType} from "../types/userstory.types.ts";

const gekiUserStorySchema = new Schema<GekiUserStoryType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	storyId: {type: Number},
	lastChapterId: {type: Number},
	jewelCount: {type: Number},
	lastPlayMusicId: {type: Number},
	lastPlayMusicCategory: {type: Number},
	lastPlayMusicLevel: {type: Number},
});

gekiUserStorySchema.index({userId: 1}, {unique: false});
gekiUserStorySchema.index({userId: 1, storyId: 1}, {unique: true});

export const GekiUserStory = mongoose.model<GekiUserStoryType>("GekiUserStory", gekiUserStorySchema);