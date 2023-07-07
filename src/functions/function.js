const collection = require("../connections/collection");
const socketMappingMethods = require("../models/socketIdMapping");
const contactsMethods = require("../models/contacts");

let functions = {};

// Function to send the message to the receiver 
// It will get the socketId of the receiver and send the message to the receiver
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

// Function to send the message to the receiver socketId using socket emit
functions.sendMessageToReceiver = (socket, contactData, receiverSocketId) => {
    socket.to(receiverSocketId).emit("listen_to_all_sender_messages", contactData);
}

module.exports = functions;