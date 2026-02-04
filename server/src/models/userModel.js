const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      minlength: [3, "The length of user name can be minimum 3 characters"],
      maxlength: [31, "The length of user name can be maximum 31 characters"],
    },
    email: {
      type: String,
      required: [true, "User email is required"],
      trim: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^\w+([\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Please enter a valid email",
      },
    },
    password: {
      type: String,
      minlength: [6, "The length of user password can be minimum 6 characters"],
      set: function (v) {
        if (this.isGoogleLogin) return v;
        if (v) return bcrypt.hashSync(v, bcrypt.genSaltSync(10));
        return v;
      },
      default: null,
    },
    image: {
      type: String,
      default: "https://via.placeholder.com/150",
    },
    address: {
      type: String,
      minlength: [3, "The length of address can be minimum 3 characters"],
      default: "Not Provided",
    },
    phone: {
      type: String,
      default: "Not Provided",
    },
    isGoogleLogin: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const User = model("User", userSchema);
module.exports = User;
