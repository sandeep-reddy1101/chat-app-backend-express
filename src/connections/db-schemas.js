const mongoose = require("mongoose");
//Promises are a way of handling asynchronous operations in JavaScript,
//and by setting the Promise implementation to be global,
//it ensures that all Mongoose operations use the same Promise implementation throughout the application.
mongoose.Promise = global.Promise;

let schema = {};

schema.socketIdMapping = mongoose.Schema(
  {
  socketId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true,
    unique: true
  }
},
{
  collection: "socketIdMapping",
}
)

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

schema.contactSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    nickName: {
      type: String
    },
    phoneNo: {
      type: Number,
      required: true,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid 10-digit phone number!`,
      },
    }
  },
  {
    collection: "contacts",
    timestamps: { createdAt: true, updatedAt: true },
  }
)

schema.userInfo = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: Number,
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
    contacts: {
      type: [String],
    }
  },
  {
    collection: "userInfo",
    timestamps: { createdAt: true, updatedAt: true },
  }
);

module.exports = schema;
