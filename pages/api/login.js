import { createRouter, expressWrapper } from "next-connect";
import { setLoginSession } from "@/lib/auth";
import MongoStore from "connect-mongo";

const session = require("express-session");
const db = require("../../lib/models");
const passport = db.passport;

const router = createRouter();

const authenticate = (method, req, res) =>
	new Promise((resolve, reject) => {
		passport.authenticate(method, { session: false }, (error, token) => {
			if (error) {
				reject(error);
			} else {
				resolve(token);
			}
		})(req, res);
	});

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
	.post(async (req, res) => {
		try {
			const user = await authenticate("local", req, res);
			const session = { ...user };

			if (!user) {
				res
					.status(401)
					.send({ done: false, message: "Username or password is incorrect" });
			} else {
				await setLoginSession(res, session);
				res.status(200).send({ done: true });
			}
		} catch (error) {
			console.error(error);
			res.status(401).send(error.message);
		}
	});

export default router.handler({
	onError: (err, req, res) => {
		console.error(err.stack);
		res.status(err.statusCode || 500).end(err.message);
	},
});
