const express = require("express");
const router = express.Router();
//controllers
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth");
const {getUserById, getUser, updateUser, userPurchaseList} = require("../controllers/user");

//with route parameter less validation is required when compared to querie/body.
//as querie/body can be empty/0 length/undefined.
//params
router.param("userId", getUserById);

//routes
//read
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
router.get("/orders/user/:userId", isSignedIn, isAuthenticated, userPurchaseList);
//update
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);

module.exports = router;