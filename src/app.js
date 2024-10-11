const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const { validateSignup } = require("./utils/validate");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const userAuth = require("./middlewares/auth");

// creating an instance to user
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

// Login

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) throw new Error("Invalid Credentials!!!");
    //Validating password
    // -- Ofloaded to userSchema
    const isValidUser = await user.validatePassword(password);
    if (!isValidUser) throw new Error("Invalid Credentils!!");
    else {
      // creating JWT
      // -- Off Loaded to userSchema;
      const token = await user.getJWT();
      // sending cookie
      res.cookie("token", token);
      res.send("Login Successfull");
    }
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});
//Get profile

app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) throw new Error("Invalid token");

    const decodedMessage = await jwt.verify(token, "Umesh@123$#");
    const { _id } = decodedMessage;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("Invalid Token");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// Get User By Email API

app.get("/user", async (req, res) => {
  const email = req.body.emailId;
  try {
    const user = await User.findOne({ emailId: email });
    if (user) res.send(user);
    else res.status(404).send("User not found");
  } catch (err) {
    res.status(404).send("Something went wrong!!");
  }
});
// Get All users from DB
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users) res.send(users);
    else res.status(404).send("No users found");
  } catch (err) {
    res.status(400).send("Something went wrong!!!");
  }
});

//  Get user by USER ID
app.get("/user/id", async (req, res) => {
  const id = req.body._id;
  try {
    console.log(id);
    const user = await User.findById(id);
    if (!user) res.status(404).send("No user found wuth this id");
    else res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong!!!:" + err.message);
  }
});

// Delete a user by the User Id

app.delete("/user", async (req, res) => {
  const id = req.body.id;
  try {
    const user = await User.findByIdAndDelete(id);
    if (user) res.send("User Deleted Successfully");
    else res.status(404).send("User Not Found");
  } catch (err) {
    res.status(400).send("Something wend wrong!!!");
  }
});

// update user by user ID

app.patch("/user/:userId", async (req, res) => {
  const data = req.body;
  const userId = req.params.userId;
  const allowedData = ["age", "gender", "firstName"];

  try {
    const isAllowed = Object.keys(data).every((k) => {
      return allowedData.includes(k);
    });
    console.log(isAllowed);
    if (!isAllowed) throw new Error("Changing the above data is not allowed");
    await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    res.send("Updated Successfully");
  } catch (err) {
    res.status(400).send("Something went wrong!!!" + err.message);
  }
});

// update by User Emailid
// app.patch("/user", async (req, res) => {
//   const data = req.body;

//   try {
//     await User.findOneAndUpdate({ emailId: data.email }, data, {
//       runValidators: true,
//     });
//     res.send("Updated Successfully");
//   } catch (err) {
//     res.status(400).send("Something went wrong!!!"+ err.message);
//   }
// });

//connecting to the cluster
connectDB()
  .then(() => {
    console.log("Connection  to DataBase Established!!!");
    app.listen(7777, () => {
      console.log("Server is running!!!");
    });
  })
  .catch((err) => {
    console.error("Connection Failed!!!");
  });
