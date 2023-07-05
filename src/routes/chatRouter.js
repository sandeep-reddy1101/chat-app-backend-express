const chatMethods = require("../models/chats");

const express = require("express");
const router = express.Router();

router.post("/get-bulk-chats", (req, res) => {
    const chatIdsList = JSON.parse(req.body.chatIdsList);
    chatMethods.getBulkChatsWithChatIds(chatIdsList).then((response) => {
        res.json(response)
    }).catch(err => {
        res.json({flag: false, message: err.message, data: []})
    })
})

module.exports = router