import mongoose, {Schema, SchemaTypes} from "mongoose";
import type { GekiGameMusicType } from "../types/gamemusic.types";

const gekiGameMusicSchema = new Schema<GekiGameMusicType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	musicId: {type: Number, required: true, unique: true},
	musicName: {type: String, required: true},
	artistName: {type: String, required: true},
	artistId: {type: Number, required: true},
	series: {type: String, required: true},
	seriesId: {type: Number, required: true},
	genre: {type: String, required: true},
	genreId: {type: Number, required: true},
	levels: {
		type: [
			{
				level: {type: Number, required: true},
				difficulty: {type: Number, required: true}
			}
		],
		validate: [(val: unknown[]) => val.length === 5, "{PATH} must have exactly 5 levels"]
	},
	boss: {
		cardId: {type: Number, required: true},
		cardName: {type: String, required: true},
		level: {type: Number, required: true},
		attr: {type: String, required: true}
	},
	releaseDate: {type: Date, required: true}
});

export const GekiGameMusic = mongoose.model<GekiGameMusicType>("GekiGameMusic", gekiGameMusicSchema);