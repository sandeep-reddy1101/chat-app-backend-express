const chatsCollection = require("../connections/collection");
const userMethods = require("../models/user");

let requests = {};

requests.createNewChat = (chatObj) => {
    const chatDocument = {
        userId1: chatObj.senderId,
        userId2: chatObj.receiverId,
        chat: [chatObj]
    }
    return chatsCollection.chatsCollection().then((model) => {
        return model.insertMany(chatDocument).then((chatResponse) => {
            if(chatResponse.length > 0) {
                const userIdsArr = [chatObj.senderId, chatObj.receiverId]
                return userMethods.addChatIdToUser(userIdsArr, chatResponse[0]._id).then((userResponse) => {
                    if(userResponse){
                        return {flag: true, message: "Successfully created chat document and added it to user"}
                    }else {
                        return {flag: false, message: "Successfully created chat document but failed to added it to user"}
                    }
                }).catch(err => {
                    throw Error(err.message)
                })
            }else {
                return {flag: false, message: "Failed to create new chat document in database"}
            }
        }).catch(err => {
            throw Error(err.message)
        })
    }).catch(err => {
        throw Error(err.message)
    })
}

requests.getChatWithChatId = (chatId) => {
    return chatsCollection.chatsCollection().then((model) => {
        return model.find({_id: chatId}).then((chatResponse) => {
            if(chatResponse.length > 0){
                return {data: chatResponse, flag: true, message: "Chat document retrieved successfully"}
            }else {
                return {data: [], flag: false, message: "Chat document retrieve failed"}
            }
        }).catch(err => {
            throw Error(err.message)
        })
    }).catch(err => {
        throw Error(err.message)
    })
}

requests.checkMessageDataAndDoRespectiveAction = (messageData) => {
    if(messageData.friendPhoneNo){
        return userMethods.getUserWithPhoneNo(messageData.friendPhoneNo).then((friendUserResponse) => {
            if(friendUserResponse.length > 0) {
                const chatDocument = {
                    senderId: messageData.userId,
                    receiverId: friendUserResponse[0]._id,
                    message: messageData.message,
                    time: messageData.time? messageData.time : new Date().getTime()
                }
                return requests.createNewChat(chatDocument).then((response) => {
                    return response
                }).catch(err => {
                    throw Error(err.message)
                })
            }
        }).catch(err => {
            throw Error(err.message)
        })
    }else {
        const chatDocument = {
            senderId: messageData.userId,
            receiverId: messageData.friendId,
            message: messageData.message,
            time: messageData.time? messageData.time : new Date().getTime()
        }
        return requests.createNewChat(chatDocument).then((response) => {
            return response
        }).catch(err => {
            throw Error(err.message)
        })
    }
}

requests.getBulkChatsWithChatIds = (chatIdsArr) => {
    return chatsCollection.chatsCollection().then((model) => {
        return model.find({_id: {$in: chatIdsArr}}).then((chatsResponse) => {
            if(chatsResponse.length > 0) {
                return {flag: true, message: "chats retreived successfully", data: chatsResponse}
            }else{
                return {flag: false, message: "chats retreive failed", data: []}
            }
        }).catch(err => {
            throw Error(err.message)
        })
    }).catch(err => {
        throw Error(err.message)
    })
}

module.exports = requests;