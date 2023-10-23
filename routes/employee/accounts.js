var express = require("express");
var router = express.Router();
var db = require("../../lib/database");

/* Get */
router.get("/", async (req, res, next) => {
	console.log("employee/accounts.ejs: inside GET");
	// get all users
	let usersList = await db.GetAllUserData(3);
	accountsObj = { usersList };
	res.render("employee/accounts", accountsObj);
});

router.post("/", (req, res, next) => {
	console.log("employee/accounts.ejs: inside POST");
	let userIdForFinances = req.body.userIdForFinances;
	console.log(userIdForFinances);
	if (userIdForFinances) {
		req.session.customerAccountId = userIdForFinances;
		req.session.save(error => {
			if (error) {
				throw error;
			}
			// load finances page
			res.redirect("/employee/viewfinances");
		});
	} else {
    console.log("IS IT HERE");
		res.redirect("accounts");
	}
});

module.exports = router;
