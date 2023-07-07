const collection = require("../connections/collection");
const userMethods = require("../models/user");

requests = {};

// Creating the new contact
// Expected contactData is
// {userId: 'asda', nickName: "abc", contactPhoneNo: 123}
requests.createNewContact = (contactData) => {
  return userMethods
    .getUserWithPhoneNo(contactData.contactPhoneNo)
    .then((userResponse) => {
      if (userResponse) {
        const contactDocument = {
          ...contactData,
          contactUserId: userResponse._id,
        }
        return collection
          .contactsCollection()
          .then((model) => {
            return model
              .insertMany(contactDocument)
              .then((contactResponse) => {
                if (contactResponse.length > 0) {
                  return contactResponse;
                } else {
                  return null;
                }
              })
              .catch((err) => {
                throw Error(err.message);
              });
          })
          .catch((err) => {
            throw Error(err.message);
          });
      } else {
        throw Error("user doesn't exist with the given phone number");
      }
    });
};

// Getting all contact documents for the user with userId
requests.getAllContactsWithUserId = (userId) => {
  return collection
    .contactsCollection()
    .then((model) => {
      return model
        .find({ userId: userId })
        .then((contactsResponse) => {
          if (contactsResponse.length > 0) {
            return contactsResponse;
          } else {
            return null;
          }
        })
        .catch((err) => {
          throw Error(err.message);
        });
    })
    .catch((err) => {
      throw Error(err.message);
    });
};

// Function to update the contact document with senderId and receiverId
// It will update chatId, lastMessageInfo and active fields of contact document
requests.updateContactChatId = (chatDocument, chatId) => {
  const messageData = chatDocument.chat[0];
  const messageDocument = {
    senderId: messageData.senderId,
    receiverId: messageData.receiverId,
    message: messageData.message,
    time: messageData.time,
  }
  return collection
    .contactsCollection()
    .then((model) => {
      return model
        .updateMany(
          {
            $and: [
              { userId: { $in: chatDocument.participants } },
              { contactUserId: { $in: chatDocument.participants } },
            ],
          },
          {
            $set: {
              chatId: chatId,
              lastMessageInfo: messageDocument,
              active: true,
            },
          }
        )
        .then((response) => {
          if (response.matchedCount === 2 && response.modifiedCount === 2) {
            return true;
          } else if (response.matchedCount === 1 && response.modifiedCount === 1) {
            // TO DO if another user doesn't feed the contact information we have handle it
          }
           else {
            return false;
          }
        })
        .catch((err) => {
          throw Error(err.message);
        });
    })
    .catch((err) => {
      throw Error(err.message);
    });
};


// Function to update the lastMessageInfo of contact document using chatId
requests.updateLastMessageUsingChatId = (chatId, message) => {
  return collection.contactsCollection().then((model) => {
    return model.updateMany({chatId: chatId}, {$set : {lastMessageInfo: message}}).then((updateResponse) => {
      if(updateResponse.matchedCount === 2 && updateResponse.modifiedCount === 2){
        return true
      }else{
        return false
      }
    }).catch((err) => {
      throw Error(err.message);
    });
  }).catch((err) => {
    throw Error(err.message);
  });
}


// Function to fetch the contact document using sender and receiver ids
requests.getContactWithSenderAndReceiverIds = (senderId, receiverId) => {
  return collection.contactsCollection().then((model) => {
    return model.findOne({ $and : [{userId: receiverId}, {contactUserId: senderId}]}).then((contactResponse) => {
      if(contactResponse){
        return contactResponse
      }else{
        return null
      }
    }).catch((err) => {
      throw Error(err.message);
    });
  }).catch((err) => {
    throw Error(err.message);
  });
}

module.exports = requests;
