import mongoose, {Schema} from "mongoose";
import type {UserType} from "../types/user.types.ts";

const userSchema = new Schema<UserType>({
	discordId: {type: String, required: true},
	username: {type: String, required: true},
	lastLogin: {type: Date, required: true, default: Date.now}
}, {timestamps: true});

userSchema.index({discordId: 1});

export const User = mongoose.model("User", userSchema);