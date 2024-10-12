const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");

// creating an instance to user
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);

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
