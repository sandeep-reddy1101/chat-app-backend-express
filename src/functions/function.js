const collection = require("../connections/collection");
const socketMappingMethods = require("../models/socketIdMapping");
const contactsMethods = require("../models/contacts");

let functions = {};

functions.checkAndSendMessageToReceiver = (socket, senderId, receiverId) => {
    socketMappingMethods.getSocketIdWithUserId(receiverId).then((receiverSocketId) => {
        if(receiverSocketId) {
            contactsMethods.getContactWithSenderAndReceiverIds(senderId, receiverId).then((contact) => {
                console.log(" >>>> ", receiverSocketId, contact)
                functions.sendMessageToReceiver(socket, contact, receiverSocketId)
            })
        }else{
            // TODO: create a pending message for the receiver socket id
        }
    })
}

functions.sendMessageToReceiver = (socket, contactData, receiverSocketId) => {
    socket.to(receiverSocketId).emit("listen_to_all_sender_messages", contactData);
}

module.exports = functions;