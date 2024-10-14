const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../middlewares/userAuth");
const { validateInputData } = require("../utils/validate");
const bcrypt = require("bcrypt");
const user = require("../models/user");

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("Invalid Token");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const isValidData = validateInputData(req);
    if (!isValidData) throw new Error("Invalid Update Request");
    else {
      const loggedInUser = req.user;
      Object.keys(req.body).forEach(
        (key) => (loggedInUser[key] = req.body[key])
      );
      await loggedInUser.save();
      console.log(loggedInUser);

      res.send("Data Updated successfully!");
    }
  } catch (err) {
    res.status(400).send("Error" + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const newPassword = req.body.password;
    console.log(newPassword);
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const user = req.user;
    user.password = passwordHash;
    await user.save();
    res.send("Password Changed");
  } catch (err) {
    res.status(400).send("Error" + err.message);
  }
});

module.exports = profileRouter;
