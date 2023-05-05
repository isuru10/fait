const db = require("../../lib/models");
const passport = db.passport;
const User = db.user;

export default async function signup(req, res) {
	User.register(
		{ username: req.body.username },
		req.body.password,
		function (err, user) {
			if (err) {
				console.error(err);
				res.status(500).end(err.message);
			} else {
				passport.authenticate("local")(req, res, function () {
					res.status(200).send({ done: true });
				});
			}
		}
	);
}
