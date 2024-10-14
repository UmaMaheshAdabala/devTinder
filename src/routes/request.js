const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const fromUserId = loggedInUser._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const allowedStatus = ["interested", "ignored"];
      const isValidStatus = allowedStatus.includes(status);
      if (!isValidStatus) throw new Error("Invalid connection request Status");
      const isConnectionExist = await connectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (isConnectionExist) throw new Error("Connection already Exixts");
      const user = await User.findById(toUserId);
      if (!user) throw new Error("Requested user not found");
      const isValidConnection = fromUserId.equals(toUserId);
      if (isValidConnection)
        throw new Error("You cannot send request to to urself");
      const newConnectionRequest = new connectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await newConnectionRequest.save();
      res.json({
        message:
          loggedInUser.firstName + " has " + status + " " + user.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      const isValidStatus = allowedStatus.includes(status);
      if (!isValidStatus) throw new Error("Invalid request status!");
      const isValidConnectionRequest = await connectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      // console.log(isValidConnectionRequest);
      if (!isValidConnectionRequest) throw new Error("Request Error!!");
      isValidConnectionRequest.status = status;
      const data = await isValidConnectionRequest.save();
      res.json({ message: "Request " + status, data });
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  }
);

module.exports = requestRouter;
