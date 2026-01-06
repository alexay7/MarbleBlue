import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {SdvxUserDataType} from "../types/userdata.types.ts";

const sdvxUserDataSchema = new Schema<SdvxUserDataType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	cardId: {type: String, required: true},
	version: {type: Number, required: true},
	lastPlayed: {type: Date, default: Date.now},
	rivals: {type: [String], default:[]},
	unlocCustoms: {type: Boolean, default:false},
	unlockCrew: {type: Boolean, default:false},
	unlockAppeal: {type: Boolean, default:false},

	name: {type: String, required: true},
	sdvxId: {type: String, required:true},
	gamecoinPacket: {type: Number, default:0},
	gamecoinBlock: {type: Number, default:0},
	appealId: {type: String, default:"0"},

	lastMusicId: {type: String, default:"0"},
	lastMusicType: {type: String, default:"0"},
	sortType: {type: String, default:"0"},
	headphone: {type: String, default:"0"},
	blasterEnergy: {type: Number, default:0},

	hispeed: {type: String, default:"0"},
	lanespeed: {type: String, default:"0"},
	gaugeOption: {type: String, default:"0"},
	arsOption: {type: String, default:"0"},
	notesOption: {type: String, default:"0"},
	earlyLateDisp: {type: String, default:"0"},
	drawAdjust: {type: String, default:"0"},
	effCLeft: {type: String, default:"0"},
	effCRight: {type: String, default:"1"},
	narrowDown: {type: String, default:"0"},

	kacId: {type: String},

	skillLevel: {type: String},
	skillBaseId: {type: String},
	skillNameId: {type: String},
	skillType: {type: String},

	supportTeamId: {type: String},

	additionalInfo: {type: {proTeamId:String}},

	eaShop: {type: {packetBooster:Number, blockBooster:Number, blasterPassEnable:String, blasterPassLimitDate:String}},

	eaappli: {type: {relation:String}},
	cloud: {type: {relation:String}},
	blockNo: {type: String},

	playCount: {type: Number, default:0},
	dayCount: {type: Number, default:0},
	todayCount: {type: Number, default:0},
	playChain: {type: Number, default:0},
	maxPlayChain: {type: Number, default:0},
	weekCount: {type: Number, default:0},
	weekPlayCount: {type: Number, default:0},
	weekChain: {type: Number, default:0},
	maxWeekChain: {type: Number, default:0},

	valgeneTicket: {type: {ticketNum:Number, limitDate:String}},

	// creatorItem: {type: {info:[{creatorType:String, itemId:String, param:String}]}},
});

sdvxUserDataSchema.index({cardId: 1, version: 1}, {unique: true});

export const SdvxUserDataModel = mongoose.model<SdvxUserDataType>("SdvxUserData", sdvxUserDataSchema);