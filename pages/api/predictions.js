import { createRouter, expressWrapper } from "next-connect";
import { getLoginSession } from "@/lib/auth";
import MongoStore from "connect-mongo";

const session = require("express-session");
const db = require("../../lib/models");
const User = db.user;
const passport = db.passport;

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
			const predictions =
				(session &&
					(await User.findOne(
						{ username: session._doc.username },
						"predictions"
					).exec())) ??
				null;

			res.status(200).json(predictions);
		} catch (error) {
			console.error(error);
			res.status(500).end("Authentication token is invalid, please log in");
		}
	})
	.post(async (req, res) => {
		try {
			const session = await getLoginSession(req);
			const user =
				(session &&
					(await User.findOne({ username: session._doc.username }).exec())) ??
				null;

			if (user) {
				const dateTo = new Date();
				dateTo.setDate(dateTo.getDate() + 7);

				const prediction = {
					dateFrom: Date.now(),
					dateTo: dateTo,
					prediction: req.body.prediction,
				};

				user.predictions = [...user.predictions, prediction];
				user.dob = new Date(req.body.dob);

				const savedUser = await user.save();

				res.status(200).json(savedUser);
			} else {
				res.status(404).end("User not found");
			}
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
