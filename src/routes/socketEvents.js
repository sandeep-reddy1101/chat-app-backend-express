const socketMappingMethods = require("../models/socketIdMapping");
const chatMethods = require("../models/chats");

const handleSocketEvents = (io) => {
  io.on("connection", (socket) => {
    console.log("client connected >>> ", socket.id);

    socket.on("map_socketId", (userId) => {
      console.log(`mapping user ${userId} with socket ${socket.id}`);
      socketMappingMethods
        .createNewMapping(userId, socket.id)
        .then((mappingResponse) => {
          if (mappingResponse) {
            socket.emit("mapping_success", {
              userId: userId,
              socketId: socket.id,
            });
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    });

    socket.on("send_message", (messageData) => {
      console.log("message data from client >>> ", messageData);
      chatMethods.checkMessageDataAndDoRespectiveAction(messageData).then((response) => {
        socket.emit("recieve_message", response);
      })
    });

    socket.on("disconnect", () => {
      console.log("client disconnected >>> ", socket.id);
      socketMappingMethods
        .deleteSocketIdFromMapping(socket.id)
        .then((deleteResponse) => {
          console.log(`mapping deleted socket ${socket.id}`);
        })
        .catch((err) => {
          console.log(err.message);
        });
    });
  });
};

module.exports = handleSocketEvents;
