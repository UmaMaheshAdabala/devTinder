const express = require("express");
const app = express();
const { connectDB } = require("./config/database");

const User = require("./models/user");

// creating an instance to user

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Umesh",
    lastName: "Adabala",
    emailId: "umesh@gmail.com",
    password: "umesh@123",
  });
  try {
    await user.save();
    res.send("Data added Successfully!!!");
  } catch (err) {
    res.status(400).send("Data not added: " + err.message);
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
