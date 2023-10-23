var express = require("express");
var router = express.Router();
var db = require("../../lib/database");

/* Get */
router.get("/", async (req, res, next) => {
	console.log("transactionhistory.ejs: inside GET");
	// get all transactions associated with an account
	if (req.session.loggedIn) {
		let allTransfers = await db.GetUserTransfersByUserId(req.session.customerAccountId);
		console.log(allTransfers);
		res.render("admin/transactionhistory", { allTransfers });
	} else {
		res.redirect("/viewfinances");
	}
});

module.exports = router;
