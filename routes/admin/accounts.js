var express = require("express");
var router = express.Router();
var db = require("../../lib/database");

/* Get */
router.get("/", async (req, res, next) => {
	console.log("admin/accounts.ejs: inside GET");
	// get all users
	let passwordChangeSuccessMessage = req.session.passwordChangeSuccessMessage;
	let usersList = await db.GetAllUserData(1);
	if (passwordChangeSuccessMessage !== null && passwordChangeSuccessMessage !== undefined) {
		accountsObj = { usersList, passwordChangeSuccessMessage: passwordChangeSuccessMessage };
		req.session.passwordChangeSuccessMessage = null;
	} else {
		accountsObj = { usersList };
	}
	res.render("admin/accounts", accountsObj);
});

router.post("/", (req, res, next) => {
	console.log("admin/accounts.ejs: inside POST");
	let userIdForPassword = req.body.userIdForPassword;
	let userIdForFinances = req.body.userIdForFinances;
	if (userIdForPassword) {
		req.session.customerAccountId = userIdForPassword;
		req.session.save(error => {
			if (error) {
				throw error;
			}
		});
		res.redirect("/admin/changepassword");
	} else if (userIdForFinances) {
		req.session.customerAccountId = userIdForFinances;
		req.session.save(error => {
			if (error) {
				throw error;
			}
		});
		// load finances page
		res.redirect("/admin/viewfinances");
	} else {
		res.redirect("accounts");
	}
});

module.exports = router;
