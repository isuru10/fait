import { createRouter, expressWrapper } from "next-connect";

import { getLoginSession } from "@/lib/auth";
import MongoStore from "connect-mongo";

const session = require("express-session");
const db = require("../../lib/models");
const passport = db.passport;
const User = db.user;

const router = createRouter();

db.mongoose
	.connect(process.env.MONGO_URL)
	.then(() => {
		console.log("Successfully connected to MongoDB");
	})
	.catch((err) => {
		console.error("MongoDB connection failed with error:", err);
	});

router
	.use(
		expressWrapper(
			session({
				secret: process.env.SECRET,
				store: new MongoStore({
					mongoUrl: process.env.MONGO_URL,
				}),
				resave: false,
				saveUninitialized: false,
			})
		)
	)
	.use(expressWrapper(passport.initialize()))
	.use(expressWrapper(passport.session()))
	.get(async (req, res) => {
		try {
			const session = await getLoginSession(req);
			const user =
				(session &&
					(await User.findOne(
						{ username: session._doc.username },
						"username dob"
					).exec())) ??
				null;

			res.status(200).json({ user });
		} catch (error) {
			console.error(error);
			res.status(500).end("Authentication token is invalid, please log in");
		}
	});

export default router.handler({
	onError: (err, req, res) => {
		console.error(err.stack);
		res.status(err.statusCode || 500).end(err.message);
	},
});
