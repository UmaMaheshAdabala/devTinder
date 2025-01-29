const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // Getting the cookie from response
    const { token } = req.cookies;
    if (!token) res.status(401).send("Please Login!!");
    //Authenticating the cookie
    else {
      const decodedMessage = await jwt.verify(
        token,
        process.env.JWT_SECRET_STRING
      );
      const { _id } = decodedMessage;
      const user = await User.findById(_id);

      if (!user) throw new Error("User not present");
      else {
        req.user = user;
        next();
      }
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = { userAuth };
