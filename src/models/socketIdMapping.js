const collection = require("../connections/collection");

let requests = {};

// Funtion to create the mapping using userId and socketId
// First it will check whether there are any socketId mapped to the userId, if yes, it will update the new socketId to the userId
// If no, it will create the new mapping
// The response is true or false
requests.createNewMapping = (userId, socketId) => {
    return requests.getSocketIdWithUserId(userId).then((socketIdResponse) => {
        if(socketIdResponse){
            return requests.updateSocketIdForUserId(userId, socketId).then((updateResponse) => {
                if(updateResponse){
                    return true
                }else {
                    return false
                }
            }).catch(err => {
                throw Error(err.message)
            })
        }else {
            return collection.socketIdMappingCollection().then((model) => {
                return model.insertMany({userId: userId, socketId: socketId}).then((response) => {
                    if(response.length > 0){
                        return true
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
    })
}

// Function to get the socketId using userId
// The response is socketId, or null if not socketId mapped to userId
requests.getSocketIdWithUserId = (userId) => {
    return collection.socketIdMappingCollection().then((model) => {
        return model.find({userId: userId}).then((response) => {
            if(response.length > 0) {
                return response[0].socketId
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

// Function to delete the userId and socketId mapping
// The response is true or false
// This function is called when user disconneted from the server, like when user closes his window, disconnted etc
requests.deleteSocketIdFromMapping = (socketId) => {
    return collection.socketIdMappingCollection().then((model) => {
        return model.findOneAndRemove({socketId: socketId}).then((response) => {
            if(response){
                return true
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

// Function to update the socketId for the given userId
// The response is true or false
requests.updateSocketIdForUserId = (userId, socketId) => {
    return collection.socketIdMappingCollection().then((model) => {
        return model.updateOne({userId: userId}, { $set: {socketId: socketId}}).then((response) => {
            if(response.matchedCount === 1 && response.modifiedCount === 1){
                return true
            }else {
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