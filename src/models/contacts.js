const collection = require("../connections/collection");
const userMethods = require("./user");

requests = {};

requests.getBulkContactsWithIds = (contactIdsArr) => {
    return collection.contactsCollection().then((model) => {
        return model.find({_id: {$in : contactIdsArr}}).then((contactsResponse) => {
            if(contactsResponse.length > 0) {
                return contactsResponse
            }else{
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