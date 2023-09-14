const User = require("../models/user");
const Order = require("../models/order");

//middleware
exports.getUserById = (req,res,next,id) => {
    //exec does a fullfiled promise, where as async/await does thenables.
    //exec is better than simple callbacks
    User.findById(id).exec((err, user) => {
        if(err || !user){
            return res.status(400).json({
                error: "No user was found in DB"
            });
        }
        req.profile = user;
        next();
    });
};

exports.getUser = (req,res) => {
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    return res.json(req.profile);
};

exports.updateUser = (req,res) => {
    User.findByIdAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        {new: true, useFindAndModify: false}).exec(
        (err, user) => {
            if(err){
                return res.status(400).json({
                    error: "You are not authorized to update this user"
                })
            }
            req.profile.salt = undefined;
            req.profile.encry_password = undefined;
            res.json(req.profile);
        }
    )
}

exports.userPurchaseList = (res,req) => {
    Order.find({user: req.profile._id}).populate("user", "_id name")
    .exec((err,order) => {
        if(err){
            return res.status(400).json({
                error: "No Order in this accout"
            })
        }
        return res.json(order);
    });
};

exports.pushOrderInPurchaseList = (req,res,next) => {
    let purchases = [];
    req.body.order.products.forEach(product => {
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id
        });
    });
    //store this in DB
    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$push: {purchases: purchases}},
        {new: true}
    ).exec((err, purchases) => {
        if(err){
            return res.status(400).json({
                error: "Unable to save purchase list"
            });
        }
    });
    next();
};