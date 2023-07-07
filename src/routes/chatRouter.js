const chatMethods = require("../models/chats");

const express = require("express");
const router = express.Router();

router.post("/create-new-chat", (req, res) => {
    const messageData = req.body
    chatMethods.createNewChat(messageData).then((response) => {
        if(response) {
            res.json({flag: true, message: "Chat created successfully", data: response})
        }else {
            res.json({flag: false, message: "Failed to create new chat", data: []})
        }
    }).catch(err => {
        res.json({flag: false, message: err.message, data: []})
    })
})

router.get("/get-chat-with-chatId/:chatId", (req, res) => {
    const chatId = req.params.chatId;
    chatMethods.getChatWithChatId(chatId).then((response) => {
        if(response){
            res.json({flag: true, message: "Fetched chat successfully", data: response})
        }else {
            res.json({flag: false, message: "Failed to fetch chat", data: null})
        }
    }).catch(err => {
        res.json({flag: false, message: err.message, data: null})
    })
})

module.exports = router