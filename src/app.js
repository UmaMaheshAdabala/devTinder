const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  res.send({ firstName: "Umesh", lastName: "Adabala" });
});
app.post("/user", (req, res) => {
  res.send("Data posted successfully!!");
});
app.delete("/user", (req, res) => {
  res.send("Data deleted!!");
});

app.get("/test/:testid/result/:resultid", (req, res) => {
  console.log(req.params);
  res.send("Test the server!!");
});

// app.get("/home", (req, res) => {
//   res.send("Home!!");
// });

app.listen(7777, () => {
  console.log("Server is running!!!");
});
