const express = require("express");
const http = require("http");
const app = express();
require("dotenv").config();
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const cors = require("cors");
const premiumRouter = require("./routes/premium");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");

// creating an instance to user
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", premiumRouter);
app.use("/", chatRouter);

const server = http.createServer(app);

initializeSocket(server);

//connecting to the cluster
connectDB()
  .then(() => {
    console.log("Connection  to DataBase Established!!!");
    server.listen(7777, () => {
      console.log("Server is running!!!");
    });
  })
  .catch((err) => {
    console.error("Connection Failed!!!");
  });
