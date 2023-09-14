const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
//export controller
const {
	getProductById,
	createProduct,
	getProdcut,
	photo,
	updateProduct,
	deleteProduct,
	getAllProducts,
	getAllUniqueCategories,
} = require("../controllers/product");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

//params
router.param("userId", getUserById);
router.param("productId", getProductById);

//routes
//create
router.post(
	"/product/create/:userId",
	[
		//validation
		check("name", "Product Name is required and can be Max of 32 length."),
		check("description", "Descripton of Product is required."),
		check("price", "Price of the Product is needed."),
		check("category", "Category of Product is required."),
	],
	isSignedIn,
	isAuthenticated,
	isAdmin,
	createProduct
);
//read
router.get("/product/:productId", getProdcut);
router.get("/product/photo/:productId", photo);
router.get("/products", getAllProducts);
router.get("/products/categories", getAllUniqueCategories);
//update
router.put(
	"/product/:productId/:userId",
	isSignedIn,
	isAuthenticated,
	isAdmin,
	updateProduct
);
//delete
router.delete(
	"/product/:productId/:userId",
	isSignedIn,
	isAuthenticated,
	isAdmin,
	deleteProduct
);

module.exports = router;
