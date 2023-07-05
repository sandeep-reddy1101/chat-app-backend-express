const collection = require("../connections/collection");
const contactMethods = require("./contacts");
const hash = require("../services/hash");

let requests = {};

requests.getUserWithUserId = (userId) => {
    return collection.getUserInfoCollection().then((model) => {
        return model.find({_id: userId}, {password: 0}).then((response) => {
            if(response.length > 0){
                return response
            }else {
                return null
            }
        }).catch((err) => {
            throw Error(err.message)
        })
    }).catch((err) => {
        throw Error(err.message)
    })
}

requests.addUser = (userData) => {
    console.log(userData)
    return requests.getUserWithPhoneNo(userData.phoneNo).then((userResponse) => {
        if(userResponse) {
            return {message: "User already exist", flag: false}
        }else {
            return hash.hashPassword(userData.password).then((hashedPassword) => {
                userData.password = hashedPassword
                return collection.getUserInfoCollection().then((model) => {
                    return model.insertMany(userData).then((response) => {
                        if(response.length > 0) {
                            return {message: "User account created successfully", flag: true}
                        }else{
                            return {message: "Some error occured while inserting the user into database", flag: false}
                        }
                    }).catch((err) => {
                        console.log(err)
                        throw Error(err.message)
                    })
                }).catch((err) => {
                    throw Error(err.message)
                })   
            }).catch((err) => {
                throw Error(err.message)
            })
        }
    }).catch((err) => {
        throw Error(err.message)
    })
    
}

requests.verifyUserLogin = (phoneNo, password) => {
    return requests.getUserWithPhoneNo(phoneNo).then((userResponse) => {
        if(userResponse){
            const encryptedPassword = userResponse[0].password
            return hash.comparePassword(password, encryptedPassword).then((hashResponse) => {
                if(hashResponse) {
                    return {flag: true, message: "User verified", data: userResponse}
                }else{
                    return {flag: false, message: "Password is wrong", data: []}
                }
            })
        }else{
            return {flag: false, message: "No user found with the phone no", data: []}
        }
    })
}

requests.getUserWithPhoneNo = (phoneNo) => {
    return collection.getUserInfoCollection().then((model) => {
        return model.find({phoneNo: parseInt(phoneNo)}).then((response) => {
            if(response.length > 0) {
                return response
            }else {
                return null
            }
        }).catch((err) => {
            throw Error(err.message)
        })
    }).catch((err) => {
        throw Error(err.message)
    })
}

requests.getAllUsers = () => {
    return collection.getUserInfoCollection().then((model) => {
        return model.find({}).then((response) => {
            if(response.length > 0) {
                return response
            }else {
                return null
            }
        }).catch((err) => {
            throw Error(err.message)
        })
    }).catch((err) => {
        throw Error(err.message)
    })
}

requests.getChatsOfUser = (userId) => {
    return collection.getUserInfoCollection().then((model) => {
        return model.find({_id: userId}).then((userChats) => {
            if(userChats.length > 0) {
                return userChats[0].chats
            }else {
                return null
            }
        }).catch((err) => {
            throw Error(err.message)
        })
    }).catch((err) => {
        throw Error(err.message)
    })
}
 
requests.addContactToUserId = (userId, contactId) => {
    console.log("userId >>>> ", userId, "   contact id >>> ",contactId)
    return collection.getUserInfoCollection().then((model) => {
        return model.updateOne({_id: userId}, {$push: {contacts: contactId}}).then((response) => {
            if(response.matchedCount === 1 && response.modifiedCount === 1){
                return true
            }else {
                return false
            }
        }).catch((err) => {
            console.log("here >>>> ", err.message)
            throw Error(err.message)
        })
    }).catch((err) => {
        throw Error(err.message)
    })
}

requests.createContact = (userId, contactObj) => {
    return requests.getUserWithPhoneNo(contactObj.phoneNo).then((userResponseWithPhoneNo) => {
        if(userResponseWithPhoneNo) {
            return collection.contactsCollection().then((model) => {
                return model.insertMany(contactObj).then((response) => {
                    if(response.length > 0) {
                        const contactId = response[0]._id;
                        return requests.addContactToUserId(userId, contactId).then((result) => {
                            if(result){
                                return true
                            }else{
                                throw Error("contact created successfully but error occured while adding contact to user.");
                            }
                        })
                    }else {
                        return null
                    }
                }).catch((err) => {
                    throw Error(err.message)
                })
            }).catch((err) => {
                throw Error(err.message)
            })
        }else{
            throw Error("No user found with the phone number");
        }
    })  
}

requests.addChatIdToUser = (userIdsArr, chatId) => {
    return collection.getUserInfoCollection().then((model) => {
        return model.updateMany({_id: {$in: userIdsArr}}, {$push: {chats : chatId}}).then((userResponse) => {
            if(userResponse.matchedCount === 2 && userResponse.modifiedCount === 2) {
                return true
            }else {
                return false
            }
        }).catch((err) => {
            throw Error(err.message)
        })
    }).catch((err) => {
        throw Error(err.message)
    })
}

module.exports = requests;