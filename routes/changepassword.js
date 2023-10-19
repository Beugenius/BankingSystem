var express = require("express");
var router = express.Router();
var db = require("../lib/database");

/* Get */
router.get("/", async (req, res, next) => {
	console.log("changepassword.ejs: inside GET");
	let salt = await db.GetSaltByEmail(req.session.email);
	res.render("changepassword", { salt: salt });
});

/* Post */
router.post("/", async (req, res, next) => {
	console.log("changepassword.ejs: inside POST");
	let hash = req.body.hash;
  let currentHash = req.body.currentHash; 
	let userId = await db.GetUserIdByEmail(req.session.email);
	let authenticated = await db.AuthenticateUserByIdAndHashedPassword(userId, currentHash);
	if (authenticated) {
    await db.ChangeUserHashedPasswordById(userId, hash);
    res.redirect("accounts");
	} else {
    res.render("changepassword", {passwordMessage: "Incorrect password"});
	}
});

module.exports = router;
