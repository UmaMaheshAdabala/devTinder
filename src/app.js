const express = require("express");

const app = express();
const { adminAuth, userAuth } = require("./middlewares/auth");
// Admin Auth
app.use("/admin", adminAuth);
//user Auth
// app.use("/user", userAuth);

app.get("/admin/getAllData", (req, res) => {
  res.send("All the data sent successfully!!!");
});

app.get("/user/getAllData", userAuth, (req, res) => {
  res.send("All the user data sent!!!");
});

app.get("/admin/deleteData", (req, res) => {
  res.send("Data Deleted!!!");
});

app.get("/user/deleteData", userAuth, (req, res) => {
  res.send("User Deleted!!!");
});

//----------------------------------------------------------------

// app.get("/user", (req, res) => {
//   res.send({ firstName: "Umesh", lastName: "Adabala" });
// });
// app.post("/user", (req, res) => {
//   res.send("Data posted successfully!!");
// });
// app.delete("/user", (req, res) => {
//   res.send("Data deleted!!");
// });

// app.get("/test/:testid/result/:resultid", (req, res) => {
//   console.log(req.params);
//   res.send("Test the server!!");
// });

// app.get("/home", (req, res) => {
//   res.send("Home!!");
// });

app.listen(7777, () => {
  console.log("Server is running!!!");
});
