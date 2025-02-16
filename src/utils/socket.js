const socket = require("socket.io");

const crypto = require("crypto");
const { Chat } = require("../models/chat");

const getSecretRoomId = (userId, targetId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetId].sort().join("$"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    // Events

    socket.on("joinChat", ({ fromUser, userId, targetId }) => {
      const roomId = getSecretRoomId(userId, targetId);
      console.log(fromUser + " JoinedRoom " + roomId);
      socket.join(roomId);
    });
    socket.on("sendMessage", async ({ fromUser, userId, targetId, text }) => {
      // Save Messages in DB also

      try {
        const roomId = getSecretRoomId(userId, targetId);
        let chat = await Chat.findOne({
          participants: { $all: [userId, targetId] },
        });

        if (!chat) {
          chat = new Chat({
            participants: [userId, targetId],
            messages: [],
          });
        }

        chat.messages.push({
          senderId: userId,
          text,
        });

        await chat.save();

        io.to(roomId).emit("messageReceived", { fromUser, text }); // will be listened from client side....
        console.log(fromUser + "  " + text);
      } catch (err) {}
    });
    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
