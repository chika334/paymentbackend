const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    firstname: {
		type: String,
		min: 6,
		trim: true,
		require: true
	},
	middlename: {
		type: String,
		min: 6,
		trim: true,
		require: true
	},
	lastname: {
		type: String,
		min: 6,
		trim: true,
		require: true
	},
	name: {
		type: String,
		min: 6,
		trim: true,
		require: true
	},
	email: {
		type: String,
		unique: true,
		trim: true,
		lowercase: true,
		require: true
	},
	birthday: {
		type: String,
		min: 6,
		trim: true,
		require: true
	},
	companyname: String,
	companyaddress: String, 
	homeaddress: String,
	alternatephone: String,
	localgov: String,
	State: String,
	identity: String,
	talk: String,
	bvn: {
		type: Number,
	},
	bvnphone: {
		type: Number,
	},
	caccertificate: { 
	    path: String,
	},
	passport: { 
	    path: String,
	},
	bill: { 
	    path: String,
	},
	idcard: { 
	    path: String,
	},
	password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
	role: {
		type: Number,
		default: 0
	}
}, { timestamp: true })

UserSchema.methods = {
  generateAuthToken: function() {
    return jwt.sign({_id: this._id}, process.env.JWT_SECRET)
  }
}

module.exports = mongoose.model('User', UserSchema)
