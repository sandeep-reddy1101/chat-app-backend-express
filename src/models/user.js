const collection = require("../connections/collection");
const hash = require("../services/hash");

let requests = {};

// getting user document with user id.
// returns everything in user document except password.
requests.getUserWithUserId = (userId) => {
    return collection.usersCollection().then((model) => {
        return model.findOne({_id: userId}, {password: 0}).then((response) => {
            if(response){
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

// Creating new user
// expected userData parameter is {firstName: "sa", lastName: "asdf", phoneNo: 234, password: "dfa", profilePic: ''}
// 
requests.createNewUser = (userData) => {
    return requests.getUserWithPhoneNo(userData.phoneNo).then((userResponse) => {
        if(userResponse) {
            return {message: "User already exist", flag: false}
        }else {
            return hash.hashPassword(userData.password).then((hashedPassword) => {
                userData.password = hashedPassword
                return collection.usersCollection().then((model) => {
                    return model.insertMany(userData).then((response) => {
                        if(response.length > 0) {
                            return {message: "User account created successfully", flag: true}
                        }else{
                            return {message: "Some error occured while creating the user", flag: false}
                        }
                    }).catch((err) => {
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

// verifying the user login using phoneNo and password
// returning the user document back except password if verified 
requests.verifyUserLogin = (phoneNo, password) => {
    return collection.usersCollection().then((model) => {
        return model.findOne({phoneNo: phoneNo}).then((userResponse) => {
            if(userResponse) {
                const encryptedPassword = userResponse.password;
                return hash.comparePassword(password, encryptedPassword).then((hashResponse) => {
                    if(hashResponse) {
                        const returnArr = {
                            firstName: userResponse.firstName,
                            lastName: userResponse.lastName,
                            phoneNo: userResponse.phoneNo,
                            _id: userResponse._id,
                            profilePic: userResponse.profilePic
                        }
                        return {flag: true, message: "User verified", data: returnArr}
                    }else{
                        return {flag: false, message: "Password is wrong", data: null}
                    }
                }).catch((err) => {
                    throw Error(err.message)
                })
            }else {
                return {flag: false, message: "No user found with the phone no", data: null}
            }
        }).catch((err) => {
            throw Error(err.message)
        })
    }).catch((err) => {
        throw Error(err.message)
    })
}

// Getting user document with phoneNo
requests.getUserWithPhoneNo = (phoneNo) => {
    return collection.usersCollection().then((model) => {
        return model.findOne({phoneNo: parseInt(phoneNo)}, {password: 0}).then((response) => {
            if(response) {
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
    return collection.usersCollection().then((model) => {
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

module.exports = requests;