import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {GekiUserChapterType, GekiUserMemoryChapterType} from "../types/userchapter.types.ts";

const gekiUserChapterSchema = new Schema<GekiUserChapterType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	chapterId: {type: Number, required: true},
	jewelCount: {type: Number, default: 0},
	lastPlayMusicCategory: {type: Number, default: 0},
	lastPlayMusicId: {type: Number, default: 0},
	lastPlayMusicLevel: {type: Number, default: 0},
	isStoryWatched: {type: Boolean, default: false},
	isClear: {type: Boolean, default: false},
	skipTiming1: {type: Number, default: 0},
	skipTiming2: {type: Number, default: 0},
});

gekiUserChapterSchema.index({userId: 1}, {unique: false});
gekiUserChapterSchema.index({userId: 1, chapterId: 1}, {unique: true});

export const GekiUserChapter = mongoose.model<GekiUserChapterType>("GekiUserChapter", gekiUserChapterSchema);


const gekiUserMemoryChapterSchema = new Schema<GekiUserMemoryChapterType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	chapterId: {type: Number, required: true},
	jewelCount: {type: Number, default: 0},
	lastPlayMusicCategory: {type: Number, default: 0},
	lastPlayMusicId: {type: Number, default: 0},
	lastPlayMusicLevel: {type: Number, default: 0},
	isDialogWatched: {type: Boolean, default: false},
	isStoryWatched: {type: Boolean, default: false},
	isBossWatched: {type: Boolean, default: false},
	isEndingWatched: {type: Boolean, default: false},
	isClear: {type: Boolean, default: false},
	gaugeId: {type: Number, default: 0},
	gaugeNum: {type: Number, default: 0},
});

gekiUserMemoryChapterSchema.index({userId: 1}, {unique: false});
gekiUserMemoryChapterSchema.index({userId: 1, chapterId: 1}, {unique: true});

export const GekiUserMemoryChapter = mongoose.model<GekiUserMemoryChapterType>("GekiUserMemoryChapter", gekiUserMemoryChapterSchema);