import mongoose from "mongoose";
import passport from "passport";
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");

passport.use(db.user.createStrategy());

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	db.user
		.findById(id)
		.exec()
		.then((user) => {
			done(null, user);
		})
		.catch((err) => {
			done(err, null);
		});
});

db.passport = passport;

module.exports = db;
