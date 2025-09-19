import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {GekiUserMusicDetailType} from "../types/usermusicdetail.types.ts";

const gekiUserMusicDetailSchema = new Schema<GekiUserMusicDetailType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true},

	musicId: {type: Number, required: true},
	level: {type: Number, required: true},
	playCount: {type: Number, default: 0},
	techScoreMax: {type: Number, default: 0},
	techScoreRank: {type: Number, default: 0},
	battleScoreMax: {type: Number, default: 0},
	battleScoreRank: {type: Number, default: 0},
	platinumScoreMax: {type: Number, default: 0},
	platinumScoreStar: {type: Number, default: 0},
	maxComboCount: {type: Number, default: 0},
	maxOverKill: {type: Number, default: 0},
	maxTeamOverKill: {type: Number, default: 0},
	isFullBell: {type: Boolean, default: false},
	isFullCombo: {type: Boolean, default: false},
	isAllBreake: {type: Boolean, default: false},
	isLock: {type: Boolean, default: false},
	clearStatus: {type: Number, default: 0},
	isStoryWatched: {type: Boolean, default: false},
});

gekiUserMusicDetailSchema.index({userId: 1}, {unique: false});
gekiUserMusicDetailSchema.index({userId: 1, musicId: 1, level: 1}, {unique: true});

export const GekiUserMusicDetail = mongoose.model<GekiUserMusicDetailType>("GekiUserMusicDetail", gekiUserMusicDetailSchema);