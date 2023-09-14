const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getProductById = (req, res, next, id) => {
	Product.findById(id)
		.populate("category")
		.exec((err, product) => {
			if (err) {
				return res.status(400).json({
					error: "Product not found",
				});
			}
			req.product = product;
			//console.log(req.product);
		});
	//console.log("xx");
	next();
};

exports.createProduct = (req, res) => {
	let form = new formidable.IncomingForm();
	form.keepExtensions = true;
	form.parse(req, (err, fields, file) => {
		if (err) {
			return res.status(400).json({
				error: "Problem with image.",
			});
		}
		//destructure the fields
		const { name, description, price, category, stock } = fields;
		//restriction on fields
		if (!name || !description || !price || !category || !stock) {
			return res.status(400).json({
				error: "Please include all fields",
			});
		}
		let product = new Product(fields);
		//handle file
		if (file.photo) {
			if (file.photo.size > process.env.MAX_FILE_SIZE) {
				return res.status(400).json({
					error: "File size too big.",
				});
			}
			product.photo.data = fs.readFileSync(file.photo.path);
			product.photo.contentType = file.photo.type;
		}
		//save product DB
		product.save((err, product) => {
			if (err) {
				return res.status(400).json({
					error: "Saving the Product in DB Failed",
				});
			}
			res.json(product);
		});
	});
};

exports.getProdcut = (req, res) => {
	req.product.photo = undefined;
	return res.json(req.product);
};

exports.photo = (req, res, next) => {
	//console.log(req.product);
	if (req.product.photo.data) {
		res.set("Content-Type", req.product.photo.contentType);
		return res.send(req.product.photo.data);
	}
	next();
};

exports.deleteProduct = (req, res) => {
	let product = req.product;
	product.remove((err, deletedProduct) => {
		if (err) {
			return res.status(400).json({
				error: "Failed to delete the product",
			});
		}
		res.json({
			message: "Deleted the Product Successfully",
			deletedProduct,
		});
	});
};

exports.updateProduct = (req, res) => {
	let form = new formidable.IncomingForm();
	form.keepExtensions = true;
	form.parse(req, (err, fields, file) => {
		if (err) {
			return res.status(400).json({
				error: "Problem with image.",
			});
		}
		let product = req.product;
		product = _.extend(product, fields);
		//handle file
		if (file.photo) {
			if (file.photo.size > process.env.MAX_FILE_SIZE) {
				return res.status(400).json({
					error: "File size too big.",
				});
			}
			product.photo.data = fs.readFileSync(file.photo.path);
			product.photo.contentType = file.photo.type;
		}
		//save product DB
		product.save((err, product) => {
			if (err) {
				return res.status(400).json({
					error: "Updation of Product in DB Failed",
				});
			}
			res.json(product);
		});
	});
};

exports.getAllProducts = (req, res) => {
	let limit = req.query.limit ? parseInt(req.query.limit) : 8;
	let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
	Product.find()
		.select("-photo")
		.populate("category")
		.sort([[sortBy, "asc"]])
		.limit(limit)
		.exec((err, products) => {
			if (err) {
				return res.status(400).json({
					error: "No Products in the DB.",
				});
			}
			res.json(products);
		});
};

exports.getAllUniqueCategories = (req, res) => {
	Product.distinct("category", {}, (err, category) => {
		if (err) {
			return res.status(400).json({
				error: "No Category found",
			});
		}
		res.json(category);
	});
};

exports.updateStock = (req, res, next) => {
	let bulkOps = req.body.order.products.map((prod) => {
		return {
			updateOne: {
				filter: { _id: prod._id },
				update: { $inc: { stock: -prod.count, sold: +prod.count } },
			},
		};
	});
	Product.bulkWrite(bulkOps, {}, (err, products) => {
		if (err) {
			return res.status(400).json({
				error: "Bulk operations for stock update failed",
			});
		}
		res.json({
			message: "Bulk operation for stock update successfull",
		});
	});
	next();
};
