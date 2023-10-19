var express = require("express");
var router = express.Router();
var db = require("../lib/database");

/* Get */
router.get("/", (req, res, next) => {
	console.log("login.ejs: inside GET");
	res.render("login", { emailFocus: true, passwordFocus: false });
});

/* Post */
router.post("/", async (req, res, next) => {
	console.log("login.ejs: inside POST");
	// user is providing email and password
	if (req.body.hash) {
		const email = req.body.email;
		const hash = req.body.hash;
		var userId = await db.GetUserIdByEmail(email);
		console.log("User ID: " + userId);
		console.log(hash);
		let authenticated = await db.AuthenticateUserByIdAndHashedPassword(userId, hash);
		console.log("Authenticated: " + authenticated);
		if (authenticated == true) {
			var userInfo = await db.GetUserDataByEmail(email);
			req.session.roleId = userInfo.role_id;
			req.session.username = userInfo.first_name;
			req.session.loggedIn = true;
			req.session.email = email;
			req.session.save(error => {
				if (error) {
					throw error;
				}
				console.log("Inside session save with email value of: " + req.session.email);
				res.redirect("accounts");
			});
		} else {
			var salt = await db.GetSaltByEmail(req.body.email);
			res.render("login", {
				passwordMessage: "Invalid password",
				email: email,
				salt: salt,
				emailFocus: false,
				passwordFocus: true,
			});
		}
	} else if (req.body.email) {
		// user has only provided email
		var salt = await db.GetSaltByEmail(req.body.email);
		// if we get the salt, email is valid
		if (salt) {
			res.render("login", {
				salt: salt,
				email: req.body.email,
				emailFocus: false,
				passwordFocus: true,
			});
		} else {
			// otherwise bad email
			res.render("login", {
				email: req.body.email,
				message: "Invalid email address",
				passwordFocus: true,
				emailFocus: false,
			});
		}
	} else {
		// user has provided nothing
		res.render("login", {
			message: "Please enter email address",
			emailFocus: true,
			passwordFocus: false,
		});
	}
});

module.exports = router;
