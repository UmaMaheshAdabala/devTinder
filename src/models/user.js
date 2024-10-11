const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) throw new Error("Invalid EmailId");
      },
    },
    password: {
      type: String,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female"].includes(value))
          throw new Error("Gender is not valid!!");
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  //creating JWT token
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Umesh@123$#", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (userInputPassword) {
  const user = this;
  const isValidUser = await bcrypt.compare(userInputPassword, user.password);

  return isValidUser;
};

module.exports = mongoose.model("User", userSchema);
