import MongoStore from "connect-mongo";
import { createRouter, expressWrapper } from "next-connect";
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
				store: new MongoStore({ mongoUrl: process.env.MONGO_URL }),
				resave: false,
				saveUninitialized: false,
			})
		)
	)
	.use(expressWrapper(passport.initialize()))
	.use(expressWrapper(passport.session()))
	.post(async (req, res) => {
		User.register(
			{ username: req.body.username },
			req.body.password,
			function (err, user) {
				if (err) {
					console.error(err);
					res.status(500).send({ done: false, message: err.message });
				} else {
					passport.authenticate("local")(req, res, function () {
						res.status(200).send({ done: true });
					});
				}
			}
		);
	});

export default router.handler({
	onError: (err, req, res) => {
		console.error(err.stack);
		res.status(err.statusCode || 500).end(err.message);
	},
});
