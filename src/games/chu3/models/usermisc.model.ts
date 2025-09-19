import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {
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

const chu3UserMiscSchema = new Schema<Chu3UserMiscType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	cardId: {type: String, ref: "Card", required: true},

	recentRatingList: {type: [userRatingSchema], default: []},
	ratingBaseHotList: {type: [userRatingSchema], default: []},
	ratingBaseList: {type: [userRatingSchema], default: []},

	favoriteMusicList: {type: [userMusicFavoriteSchema], default: []},
	favoriteCharacterList: {type: [userMusicFavoriteSchema], default: []},
	rivalList: {type: [userRivalSchema], default: []},

	chatSymbols: {type: [Number], default: []},
});

chu3UserMiscSchema.index({cardId: 1}, {unique:true});

export const Chu3UserMisc = mongoose.model("Chu3UserMisc", chu3UserMiscSchema);