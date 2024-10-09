const express = require("express");
const app = express();
const { connectDB } = require("./config/database");

const User = require("./models/user");

// creating an instance to user
app.use(express.json());
// app.post("/signup", async (req, res) => {
//   const user = new User(req.body);
//   try {
//     await user.save();
//     res.send("Data added Successfully!!!");
//   } catch (err) {
//     res.status(400).send("Data not added: " + err.message);
//   }
// });

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

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users) res.send(users);
    else res.status(404).send("No users found");
  } catch (err) {
    res.status(400).send("Something went wrong!!!");
  }
});

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

//connecting to the cluster
connectDB()
  .then(() => {
    console.log("Connection  to DataBase Established!!!");
    app.listen(7777, () => {
      console.log("Server is running!!!");
    });
  })
  .catch((err) => {
    console.err("Connection Failed!!!");
  });
