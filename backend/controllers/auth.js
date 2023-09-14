const User = require("../models/user");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

//signup
exports.signup = (req, res) => {
	//validation
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: {
				msg: errors.array()[0].msg,
				param: errors.array()[0].param,
			},
		});
	}
	//create new user and save in the DB
	const user = new User(req.body);
	user.save((err, user) => {
		if (err) {
			return res.status(400).json({
				error: "NOT able to save user in DB.",
			});
		}
		res.json({
			name: user.name,
			email: user.email,
			id: user._id,
		});
	});
};

//signin
exports.signin = (req, res) => {
	//validation
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: {
				msg: errors.array()[0].msg,
				param: errors.array()[0].param,
			},
		});
	}
	//find the email in the DB, email is unique.
	const { email, password } = req.body;
	//console.log(req.body);
	User.findOne({ email }, (err, user) => {
		if (err) {
			return res.status(400).json({
				error: "User email does not exist.",
			});
		}

		if (!user.autheticate(password)) {
			res.status(401).json({
				error: "Email and Password do not match.",
			});
		}
		//create a token
		//Authorization: Bearer [header].[payload].[signature]
		const token = jwt.sign({ _id: user._id }, process.env.SECRET);
		//put the token in a cookie
		res.cookie("token", token, { expire: new Date() + 9999 });
		//send response to front end
		const { _id, name, email, role } = user;
		return res.json({ token, user: { _id, name, email, role } });
	});
};

//signout
exports.signout = (req, res) => {
	res.clearCookie("token");
	res.json({
		message: "User Signout successfully",
	});
};

//protected routes
//check for token
exports.isSignedIn = expressJwt({
	//by default it looks into the authorization header (bearer)
	//The decoded JWT payload is available on the request object.
	//Default payload is set to req.auth
	secret: process.env.SECRET,
	userProperty: "auth",
});

//custom middlewares
//req.profile is set by getUserById func.
exports.isAuthenticated = (req, res, next) => {
	let checker = req.profile && req.auth && req.profile._id == req.auth._id;
	if (!checker) {
		return res.status(403).json({
			error: "ACCESS DENIED",
		});
	}
	next();
};

exports.isAdmin = (req, res, next) => {
	if (req.profile.role === 0) {
		return res.status(403).json({
			error: "You are not ADMIN, Access Denied.",
		});
	}
	next();
};
