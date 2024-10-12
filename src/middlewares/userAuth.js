const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // Getting the cookie from response
    const { token } = req.cookies;
    if (!token) throw new Error("Invalid token");
    //Authenticating the cookie
    const decodedMessage = await jwt.verify(token, "Umesh@123$#");
    const { _id } = decodedMessage;
    const user = User.findById(id);

    if (!user) throw new Error("User not present");
    else {
      req.user = user;
      next();
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = { userAuth };
