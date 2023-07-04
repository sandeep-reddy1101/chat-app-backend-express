const collection = require("../connections/collection");

let requests = {};

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

requests.updateSocketIdForUserId = (userId, socketId) => {
    return collection.socketIdMappingCollection().then((model) => {
        return model.updateOne({userId: userId}, {socketId: socketId}).then((response) => {
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