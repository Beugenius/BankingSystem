var express = require("express");
var router = express.Router();
var db = require("../../lib/database");
/* Get */
router.get("/", async (req, res, next) => {
	console.log("admin/changepassword.ejs: inside GET");
	if (req.session.roleId !== 1 || req.session.roleId == undefined || req.session.roleId == null) {
		res.redirect("/");
	} else {
		const userId = req.session.userIdToChange;
		if (userId == null || userId == undefined) {
			res.redirect("accounts");
		} else {
			const userData = await db.GetUserDataToChangePasswordById(userId);
			let passwordFailMessage = req.session.userPasswordFailMessage;
			res.render("admin/changepassword", { userData, passwordFailMessage: passwordFailMessage });
		}
	}
});

/* Post */
router.post("/", async (req, res, next) => {
	console.log("admin/changepassword.ejs: inside POST");
	const hash = req.body.hash;
	const userId = req.session.userIdToChange;
	if (hash) {
		let passwordChangedSuccessfully = await db.ChangeUserHashedPasswordById(userId, hash);
		if (passwordChangedSuccessfully) {
			req.session.userIdToChange = null;
			req.session.passwordChangeSuccessMessage = "Password updated successfully!";
			req.session.passwordFailMessage = null;
			req.session.save(error => {
				if (error) {
					throw error;
				}
				res.redirect("accounts");
			});
		} else {
			req.session.userPasswordFailMessage = "Failed to change user's password";
			req.session.save(error => {
				if (error) {
					throw error;
				}
				res.redirect("admin/changepassword");
			});
		}
	}
});

module.exports = router;
