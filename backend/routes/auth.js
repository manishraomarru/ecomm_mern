const express = require("express");
const router = express.Router();
const { signout, signup, signin } = require("../controllers/auth");
const { check, validationResult } = require("express-validator");

router.post(
	"/signup",
	[
		//validation
		check("name")
			.isLength({ min: 3 })
			.withMessage("must be at least 3 char long"),
		check("email").isEmail().withMessage("email is required"),
		check("password")
			.isLength({ min: 3 })
			.withMessage("must be at least 3 char long"),
	],
	signup
);

router.post(
	"/signin",
	[
		//validation
		check("email").isEmail().withMessage("email is required"),
		check("password")
			.isLength({ min: 3 })
			.withMessage("must be at least 3 char long"),
	],
	signin
);

router.get("/signout", signout);

module.exports = router;
