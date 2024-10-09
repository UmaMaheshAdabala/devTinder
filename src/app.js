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

// app.patch("/user", async (req, res) => {
//   const data = req.body;
//   try {
//     await User.findByIdAndUpdate(data.id, data);
//     res.send("Updated Successfully");
//   } catch (err) {
//     res.status(400).send("Something went wrong!!!");
//   }
// });

// update by User Emailid
app.patch("/user", async (req, res) => {
  const data = req.body;
  try {
    await User.findOneAndUpdate({ emailId: data.email }, data, {
      runValidators: true,
    });
    res.send("Updated Successfully");
  } catch (err) {
    res.status(400).send("Something went wrong!!!");
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
