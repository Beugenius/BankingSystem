var express = require("express");
var router = express.Router();
var db = require("../lib/database");
const e = require("express");

router.get("/", function (req, res, next) {
	res.render("signup", {});
});

router.post("/", async (req, res, next) => {
	// get all info
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const email = req.body.email;
	const dob = req.body.dob;
	const ssn = req.body.ssn;
	const hash = req.body.hash;
	const salt = req.body.salt;
	// verify email, ssn are not associated with other user accounts
	let ssnAlreadyInUse = await db.SsnAssociatedWithAnyAccount(ssn);
	let emailAlreadyInUse = await db.EmailAssociatedWithAnyAccount(email);
	if (ssnAlreadyInUse || emailAlreadyInUse) {
		res.render("signup", {
			firstName: firstName,
			lastName: lastName,
			email: email,
			dob: dob,
			ssnAlreadyInUse: ssnAlreadyInUse,
			emailAlreadyInUse: emailAlreadyInUse,
		});
	} else {
		let userCreated = await db.CreateUser(firstName, lastName, email, dob, ssn, hash, salt);
		if (userCreated) {
			// log user in
			var userInfo = await db.GetUserDataByEmail(email);
			// create default empty checking and savings account
			await db.CreateAccountsForNewUser(userInfo.user_id);
			req.session.userId = userInfo.user_id;
			req.session.roleId = userInfo.role_id;
			req.session.username = userInfo.first_name;
			req.session.loggedIn = true;
			req.session.email = email;
			req.session.save(error => {
				if (error) {
					throw error;
				}
				res.redirect("accounts");
			});
		} else {
			res.render("signup", {
				firstName: firstName,
				lastName: lastName,
				email: email,
				dob: dob,
				ssnAlreadyInUse: ssnAlreadyInUse,
				emailAlreadyInUse: emailAlreadyInUse,
				message: "Error creating account"
			});
		}
	}
});
module.exports = router;
