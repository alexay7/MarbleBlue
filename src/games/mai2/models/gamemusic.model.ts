import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {Mai2GameMusicType} from "../types/gamemusic.types.ts";

const Mai2GameMusicSchema = new Schema<Mai2GameMusicType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	id: {type: Number, required: true, unique: true},
	name: {type: String, required: true},
	sortName: {type: String},
	artistId: {type: Number},
	artist: {type: String},
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
	utageType: {type: String, required: false, default: null},
});

export const Mai2GameMusic = mongoose.model<Mai2GameMusicType>("Mai2GameMusic", Mai2GameMusicSchema);