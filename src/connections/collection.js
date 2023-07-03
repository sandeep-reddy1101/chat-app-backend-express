const schema = require("./db-schemas");
const mongoose = require("mongoose");
//Promises are a way of handling asynchronous operations in JavaScript,
//and by setting the Promise implementation to be global,
//it ensures that all Mongoose operations use the same Promise implementation throughout the application.
mongoose.Promise = global.Promise;

// Creating a collection object which we will export.
collection = {};

// Getting database URL from environment file
const dbURL = process.env.DATABASE_URL || process.env.localDB || "mongodb+srv://sandeepxsandy49:somVcyJDII5N3c5G@cluster0.uhoidoo.mongodb.net/chatDB?retryWrites=true&w=majority";

//Creating the connection for userInfo collection
collection.getUserInfoCollection = () => {
  return mongoose
    .connect(dbURL, { useNewUrlParser: true })
    .then((db) => {
      //Here we are returning the model which allows to querying and manipulating the collection.
      return db.model("userInfo", schema.userInfo);
    })
    .catch((error) => {
      console.log(error)
      throw Error(error.message)
    });
};

collection.chatsCollection = () => {
  return mongoose.connect(dbURL, { useNewUrlParser: true}).then((db) => {
    return db.model("chats", schema.chats);
  }).catch((err) => {
    console.log("error in connecting to chats databse >>> ", err.message);
    throw Error(err.message)
  })
}

collection.contactsCollection = () => {
  return mongoose.connect(dbURL, { useNewUrlParser: true}).then((db) => {
    return db.model("contacts", schema.contactSchema);
  }).catch((err) => {
    console.log("error in connecting to contacts databse >>> ", err.message);
    throw Error(err.message)
  })
}

module.exports = collection;
