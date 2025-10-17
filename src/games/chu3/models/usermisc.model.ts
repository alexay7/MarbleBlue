import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {
	Chu3UserChatSymbolType,
	Chu3UserMiscType,
	Chu3UserMusicFavoriteType,
	Chu3UserRatingType,
	Chu3UserRivalType
} from "../types/usermisc.types.ts";

const userRatingSchema = new Schema<Chu3UserRatingType>({
	musicId: {type: Number, required: true},
	difficultId: {type: Number, required: true},
	romVersionCode: {type: Number, required: true},
	score: {type: Number, required: true},
}, {_id:false});

const userMusicFavoriteSchema = new Schema<Chu3UserMusicFavoriteType>({
	id: {type: Number, required: true},
}, {_id:false});

const userRivalSchema = new Schema<Chu3UserRivalType>({
	id: {type: Number, required: true},
	ktAlias: {type: String},
}, {_id:false});
const userChatSymbolSchema = new Schema<Chu3UserChatSymbolType>({
	sceneId: {type: Number, required: true},
	symbolId: {type: Number, required: true},
	orderId: {type: Number, required: true},
}, {_id:false});

const chu3UserMiscSchema = new Schema<Chu3UserMiscType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	cardId: {type: String, ref: "Card", required: true},

	recentRatingList: {type: [userRatingSchema], default: []},
	ratingBaseHotList: {type: [userRatingSchema], default: []},
	ratingBaseList: {type: [userRatingSchema], default: []},
	ratingBaseNextList: {type: [userRatingSchema], default: []},
	ratingBaseNewList: {type: [userRatingSchema], default: []},
	userRatingBaseNewNextList: {type: [userRatingSchema], default: []},

	favoriteMusicList: {type: [userMusicFavoriteSchema], default: []},
	favoriteCharacterList: {type: [userMusicFavoriteSchema], default: []},
	rivalList: {type: [userRivalSchema], default: []},

	chatSymbols:{type: [userChatSymbolSchema], default: [
		{sceneId:1, symbolId:10001, orderId:0},
		{sceneId:1, symbolId:10002, orderId:1},
		{sceneId:1, symbolId:30001, orderId:2},
		{sceneId:1, symbolId:30013, orderId:3},


		{sceneId:2, symbolId:20001, orderId:0},
		{sceneId:2, symbolId:30001, orderId:1},
		{sceneId:2, symbolId:30002, orderId:2},
		{sceneId:2, symbolId:30003, orderId:3},


		{sceneId:3, symbolId:10003, orderId:0},
		{sceneId:3, symbolId:30001, orderId:1},
		{sceneId:3, symbolId:30002, orderId:2},
		{sceneId:3, symbolId:40001, orderId:3},


		{sceneId:4, symbolId:10004, orderId:0},
		{sceneId:4, symbolId:20002, orderId:1},
		{sceneId:4, symbolId:30004, orderId:2},
		{sceneId:4, symbolId:40002, orderId:3},


		{sceneId:5, symbolId:10005, orderId:0},
		{sceneId:5, symbolId:20002, orderId:1},
		{sceneId:5, symbolId:20003, orderId:2},
		{sceneId:5, symbolId:40002, orderId:3},
	]},
});

chu3UserMiscSchema.index({cardId: 1}, {unique:true});

export const Chu3UserMisc = mongoose.model("Chu3UserMisc", chu3UserMiscSchema);