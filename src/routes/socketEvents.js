const socketMappingMethods = require("../models/socketIdMapping");
const chatMethods = require("../models/chats");
const functions = require("../functions/function");

// Function to handle all the socket events
const handleSocketEvents = (io) => {
  io.on("connection", (socket) => {
    console.log("client connected >>> ", socket.id);

    // Listening to the map_socketId event from the client, the data we get is userId from front end
    // It will create a link between userId and socketId in the database
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

    // Listening to the send_message_to_contact event from the client website, the data we get is message data
    // messageData example : {senderId: "kasjd", receiverId: "alsdn", message: "hi", time: date}
    // This event is emitted from the user, when user wants to create new chat like when user wants to chat with new contact
    // It will create a new chat document for the participants in chat collection
    // After chat is created it will emit the message to the receiverId
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

    // Listening to the send_message_to_chat event from the client website, the data we get is chatId and message data
    // messageData example : {senderId: "kasjd", receiverId: "alsdn", message: "hi", time: date}
    // This event is emitted from the user, When user send a message in his active chats
    // It will add the message in the existing chat using chatId
    // After chat is created it will emit the message to the receiverId
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

    // Listening to the disconnect event, when the client is disconnected.
    // It will delete the userId and socketId mapping from the database.
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
