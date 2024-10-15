const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateSignup } = require("../utils/validate");

// signup
authRouter.post("/signup", async (req, res) => {
  try {
    //Encrypting Password
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    //validateing signup
    validateSignup(req);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();

    res.send("Data added Successfully!!!");
  } catch (err) {
    res.status(400).send("Data not added: " + err.message);
  }
});

//login
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) throw new Error("Email not found!!!");
    //Validating password
    // -- Ofloaded to userSchema
    const isValidUser = await user.validatePassword(password);
    if (!isValidUser) throw new Error("Invalid password!!");
    else {
      // creating JWT
      // -- Off Loaded to userSchema;
      const token = await user.getJWT();
      // sending cookie
      res.cookie("token", token);
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});

//logout
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Loggedout Successfull!!!");
});

module.exports = authRouter;
