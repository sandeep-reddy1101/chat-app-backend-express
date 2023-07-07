const socketMappingMethods = require("../models/socketIdMapping");
const chatMethods = require("../models/chats");
const functions = require("../functions/function");

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

    socket.on("send_message_to_contact", (messageData) => {
      console.log("message data from client >>> ", messageData);
      chatMethods.createNewChat(messageData).then((response) => {
        socket.emit("listen_after_sending_message_to_contact", response);
        if(response){
          functions.checkAndSendMessageToReceiver(socket, messageData.senderId, messageData.receiverId)
        }
      }).catch(err => {
        socket.emit("listen_after_sending_message_to_contact", err.message)
      })
    });

    socket.on("send_message_to_chat", (chatId, messageData) => {
      console.log("message data from client", chatId, messageData);
      chatMethods.addMessageTochat(chatId, messageData).then((response) => {
        socket.emit("listen_after_sending_message_to_chat", response)
          if(response){
            functions.checkAndSendMessageToReceiver(socket, messageData.senderId, messageData.receiverId)
          }
      }).catch(err => {
        socket.emit("listen_after_sending_message_to_chat", err.message)
      })
    })

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
