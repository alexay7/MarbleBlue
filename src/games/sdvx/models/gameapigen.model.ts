import mongoose, {Schema, SchemaTypes} from "mongoose";
import type {SdvxGameApigenType} from "../types/gameapigen.types.ts";
import fs from "fs";

const sdvxGameApigenSchema = new Schema<SdvxGameApigenType>({
	_id: {type: SchemaTypes.ObjectId, auto: true},

	id: {type: Number, required: true},
	name: {type: String, required: true},
	version: {type: Number, required: true},
	nameEnglish: {type: String, required: false},
	commonRate: {type: Number, required: false},
	uncommonRate: {type: Number, required: false},
	rareRate: {type: Number, required: false},
	price: {type: Number, required: false},
	noDuplicate: {type: Boolean, required: false},

	catalog: {
		type: [{
			id: {type: Number, required: true},
			rarity: {type: Number, required: true},
			itemType: {type: Number, required: true},
			itemId: {type: Number, required: true}
		}],
		required: false
	}
});

export const SdvxGameApigenModel =  mongoose.model<SdvxGameApigenType>("SdvxGameApigen", sdvxGameApigenSchema);

export const APIGENE7 = [
	{
		id: 1,
		name: "アピールパーツジェネレーター 第1弾",
		nameEnglish: "APPEAL PARTS GENERATOR VOL. 1",
		commonRate: 60,
		uncommonRate: 30,
		rareRate: 1,
		price: 100,
		noDuplicate: false,
		version: 7,
		catalog:
            Array.from({ length: 26 }, (_, i) => i + 1).map(id => ({
            	id:1,
            	rarity: 1,
            	itemType: 23,
            	itemId: id
            })).concat(
            	Array.from({ length: 136 }, (_, i) => i + 1).map(id => ({
            		id:1,
            		rarity: 0,
            		itemType: 24,
            		itemId: id
            	}))
            )
	}
];

fs.writeFileSync("apigen7.json", JSON.stringify(APIGENE7, null, 2), "utf-8");