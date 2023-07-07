const chatsCollection = require("../connections/collection");
const contactMethods = require("../models/contacts");

let requests = {};

requests.createNewChat = (messageData) => {
    const chatDocument = {
        participants: [messageData.senderId, messageData.receiverId],
        chat: [messageData]
    }
    return requests.getChatUsingTwoParticipantsUsersIds(chatDocument.participants).then((response) => {
        if(!response){
            return collection.chatsCollection().then((model) => {
                return model.insertMany(chatDocument).then((chatResponse) => {
                    if(chatResponse.length > 0) {
                        return contactMethods.updateContactChatId(chatDocument, chatResponse[0]._id).then((updateContact) => {
                            if(updateContact){
                                return chatResponse
                            }else{
                                throw Error("Failed to update the chat Id in contact")
                            }
                        }).catch(err => {
                            throw Error(err.message)
                        })
                    } else {
                        throw Error("Error occured while inserting the chatDocument")
                    }
                }).catch(err => {
                    throw Error(err.message)
                })
            }).catch(err => {
                throw Error(err.message)
            })
        }else{
            throw Error("chat already exist between users. Can't create new chat")
        }
    }).catch(err => {
        throw Error(err.message)
    })
}

requests.getChatUsingTwoParticipantsUsersIds = (participantsUserIdsList) => {
    const reverseParticipantsList = participantsUserIdsList.reverse();
    return collection.chatsCollection().then((model) => {
        return model.findOne({
            $or : [{participants : { $all: participantsUserIdsList}}, {participants: { $all: reverseParticipantsList}}]
          }).then((chatResponse) => {
            console.log(chatResponse)
            if(chatResponse){
                return chatResponse
            }else {
                return null
            }
          }).catch(err => {
            console.log(err)
            throw Error(err.message)
        })
    }).catch(err => {
        throw Error(err.message)
    })
} 

requests.getChatWithChatId = (chatId) => {
    return collection.chatsCollection().then((model) => {
        return model.findOne({_id: chatId}).then((chatResponse) => {
            if(chatResponse) {
                return chatResponse
            }else {
                return null
            }
        }).catch(err => {
            throw Error(err.message)
        })
    }).catch(err => {
        throw Error(err.message)
    })
}

requests.addMessageTochat = (chatId, message) => {
    return collection.chatsCollection().then((model) => {
        return model.updateOne({_id: chatId}, {$push: {chat: message}}).then((updateResponse) => {
            if(updateResponse.matchedCount === 1 && updateResponse.modifiedCount === 1) {
                return contactMethods.updateLastMessageUsingChatId(chatId, message).then((contactResponse) => {
                    if(contactResponse) {
                        return true
                    }else{
                        return false
                    }
                }).catch(err => {
                    throw Error(err.message)
                })
            }else{
                return false
            }
        }).catch(err => {
            throw Error(err.message)
        })
    }).catch(err => {
        throw Error(err.message)
    })
}

module.exports = requests;