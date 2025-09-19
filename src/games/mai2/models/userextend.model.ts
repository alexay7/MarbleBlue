import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Mai2UserExtendType} from "../types/userextend.types.ts";

const mai2UserExtendSchema = new Schema<Mai2UserExtendType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	userId: {type: String, ref: "Card", required: true, unique: true},

	selectMusicId: {type: Number, default: 0},
	selectDifficultyId: {type: Number, default: 0},
	categoryIndex: {type: Number, default: 0},
	musicIndex: {type: Number, default: 0},
	extraFlag: {type: Number, default: 0},
	selectScoreType: {type: Number, default: 0},
	extendContentBit: {type: SchemaTypes.BigInt, default: BigInt(0)},
	isPhotoAgree: {type: Boolean, default: false},
	isGotoCodeRead: {type: Boolean, default: false},
	selectResultDetails: {type: Boolean, default: false},
	sortCategorySetting: {type: Number, default: 0},
	sortMusicSetting: {type: Number, default: 0},
	playStatusSetting: {type: Number, default: 0},
	selectResultScoreViewType: {type: Number, default: 0},
	selectedCardList: {type: [Number], default: []},
	encountMapNpcList: {
		type: [{
			npcId: {type: Number},
			musicId: {type: Number},
		}],
		default: []
	},
});

export const Mai2UserExtendModel = mongoose.model<Mai2UserExtendType>("Mai2UserExtend", mai2UserExtendSchema);
