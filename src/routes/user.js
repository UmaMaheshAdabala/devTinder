const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();
const selectedFields = [
  "firstName",
  "lastName",
  "age",
  "about",
  "photoUrl",
  "gender",
];

// Pending Requests
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await connectionRequest
      .find({
        toUserId: loggedInUser._id,
        status: "interested",
      })
      .populate("fromUserId", selectedFields);
    res.json({ message: "Data fetched Successfully", connectionRequests });
    // console.log();
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

//Connections

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectedusers = await connectionRequest
      .find({
        $or: [
          { fromUserId: loggedInUser._id, status: "accepted" },
          {
            toUserId: loggedInUser._id,
            status: "accepted",
          },
        ],
      })
      .populate("fromUserId", selectedFields)
      .populate("toUserId", selectedFields);
    const data = connectedusers.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// Feed --> Suggestion about other profiles

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    const connectedUsers = await connectionRequest
      .find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      })
      .select("fromUserId toUserId");
    const hiddenUsers = new Set();
    connectedUsers.forEach((users) => {
      hiddenUsers.add(users.fromUserId.toString());
      hiddenUsers.add(users.toUserId.toString());
    });
    const usersToBeInFeed = await User.find({
      $and: [
        { _id: { $nin: Array.from(hiddenUsers) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(selectedFields)
      .skip(skip)
      .limit(limit);
    res.send(usersToBeInFeed);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = userRouter;
