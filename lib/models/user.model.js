import mongoose from "mongoose";

const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");

const userSchema = new mongoose.Schema({
	username: String,
	password: String,
	predictions: [
		{ date: { type: Date, default: Date.now }, prediction: String },
	],
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

module.exports = User;
