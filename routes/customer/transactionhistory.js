var express = require("express");
var router = express.Router();
var db = require("../../lib/database");

/* Get */
router.get("/", async (req, res, next) => {
	console.log("transactionhistory.ejs: inside GET");
	// get all transactions associated with an account
	if (req.session.loggedIn) {
		let allTransfers = await db.GetUserTransfersByUserId(req.session.userId);
		console.log(allTransfers);
		res.render("customer/transactionhistory", { allTransfers });
	} else {
		res.redirect("/login");
	}
});

/* Post */
router.post("/", (req, res, next) => {
	console.log("transactionhistory.ejs: inside POST");
	res.render("customer/accounts", {});
});

module.exports = router;
