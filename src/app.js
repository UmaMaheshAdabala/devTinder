const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello!!");
});

app.get("/test", (req, res) => {
  res.send("Test the server!!");
});

app.get("/home", (req, res) => {
  res.send("Home!!");
});

app.listen(7777, () => {
  console.log("Server is running!!!");
});
