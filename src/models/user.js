const collection = require("../connections/collection");
const hash = require("../services/hash");

let requests = {};

requests.addUser = (userData) => {
    return requests.getUserWithPhoneNo(userData.phoneNo).then((userResponse) => {
        if(userResponse) {
            return {message: "User already exist", flag: false}
        }else {
            return hash.hashPassword(userData.password).then((hashedPassword) => {
                userData.password = hashedPassword
                return collection.getUserLoginCollection().then((model) => {
                    return model.insertMany(userData).then((response) => {
                        if(response.length > 0) {
                            return {message: "User account created successfully", flag: true}
                        }else{
                            return {message: "Some error occured while inserting the user into database", flag: false}
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

requests.verifyUserLogin = (phoneNo, password) => {
    return requests.getUserWithPhoneNo(phoneNo).then((userResponse) => {
        if(userResponse){
            const encryptedPassword = userResponse[0].password
            return hash.comparePassword(password, encryptedPassword).then((hashResponse) => {
                if(hashResponse) {
                    return {flag: true, message: "User verified"}
                }else{
                    return {flag: false, message: "Password is wrong"}
                }
            })
        }else{
            return {flag: false, message: "No user found with the phone no"}
        }
    })
}

requests.getUserWithPhoneNo = (phoneNo) => {
    return collection.getUserLoginCollection().then((model) => {
        return model.find({phoneNo: phoneNo}).then((response) => {
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
    return collection.getUserLoginCollection().then((model) => {
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