const mongoose = require('mongoose');
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');
//const { v4: uuidv4 } = require('uuid');

//Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 32,
        trim: true
    },
    lastname: {
        type: String,
        maxLength: 32,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    userinfo: {
        type: String,
        trim: true
    },
    encry_password: {
        type: String,
        require: true
    },
    salt: String,
    //role indicates the privileges. 
    role: {
        type: Number,
        default: 0
    },
    purchases: {
        type: Array,
        default: []
    }
}, {timestamps: true});

userSchema.virtual("password")
    .set(function(password){
        this._password = password;
        this.salt =  uuidv1();
        this.encry_password = this.securePassword(password);
    })
    .get(function() {
        return this._password;
    });
    
userSchema.methods = {
    autheticate: function(plainPassword){
        return this.securePassword(plainPassword) === this.encry_password;
    },
    securePassword: function(plainPassword){
        if(!plainPassword) return "";
        try {
            return crypto.createHmac('sha256', this.salt)
            .update(plainPassword)
            .digest('hex');
        } catch (err){
            return "";
        }
    }
}

//Model
module.exports = mongoose.model("User", userSchema);
