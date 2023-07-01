const mongoose = require("mongoose");
//Promises are a way of handling asynchronous operations in JavaScript,
//and by setting the Promise implementation to be global,
//it ensures that all Mongoose operations use the same Promise implementation throughout the application.
mongoose.Promise = global.Promise;

let schema = {};

schema.message = mongoose.Schema({
  senderId: {
    type: String,
    required: true,
  },
  receiverId: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date().getTime(),
  },
  updatedAt: {
    type: Date,
    default: new Date().getTime(),
  },
});

schema.chats = mongoose.Schema(
  {
    chats: {
      type: [schema.message],
      default: [],
    },
  },
  {
    collection: "userLogin",
    timestamps: { createdAt: true, updatedAt: true },
  }
);

schema.userLogin = mongoose.Schema(
  {
    phoneNo: {
      type: Number,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid 10-digit phone number!`,
      },
    },
    password: {
      type: String,
      required: true,
    },
    chats: {
      type: [String],
      default: [],
    },
  },
  {
    collection: "userLogin",
    timestamps: { createdAt: true, updatedAt: true },
  }
);

module.exports = schema;
