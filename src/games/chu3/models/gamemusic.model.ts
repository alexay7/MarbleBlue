import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Chu3GameMusicType} from "../types/gamemusic.types.ts";

const Chu3GameMusicSchema = new Schema<Chu3GameMusicType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	id: {type: Number, required: true, unique: true},
	name: {type: String, required: true},
	sortName: {type: String},
	artistId: {type: Number},
	artist: {type: String},
	series: {type: String},
	seriesId: {type: Number},
	genre: {type: String},
	genreId: {type: Number},
	levels: {
		type: [{
			level: {type: Number},
			difficulty: {type: Number},
		}],
		required: true,
		default: [],
	},
	worldsEndDiff: {type: Number, required: false, default: null},
	worldsEndType: {type: String, required: false, default: null},
});

export const Chu3GameMusic = mongoose.model<Chu3GameMusicType>("Chu3GameMusic", Chu3GameMusicSchema);