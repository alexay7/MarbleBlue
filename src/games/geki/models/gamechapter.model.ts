import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {GekiGameChapterType} from "../types/gamechapter.types.ts";

const gekiGameChapterSchema = new Schema<GekiGameChapterType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	chapterId: {type: Number, required: true, unique: true},
	chapterName: {type: String, required: true},

	musics: {
		type: [
			{
				musicId: {type: Number, required: true},
				musicName: {type: String, required: true},
			},
		],
		default: [],
	},

	shopItems: {
		type: [
			{
				itemId: {type: Number, required: true},
				itemName: {type: String, required: true},
				itemType: {type: String, required: true},
			},
		],
		default: [],
	},
});

export const GekiGameChapter = mongoose.model<GekiGameChapterType>("GekiGameChapter", gekiGameChapterSchema);