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
      unique: true,
    },
    userId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    collection: "socketIdMapping",
  }
);

const message = mongoose.Schema({
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
  time: {
    type: Date,
    default: Date.now,
  },
});

schema.chats = mongoose.Schema(
  {
    participants: {
      type: [String],
      required: true,
      unique: true
    },
    chat: {
      type: [message],
      default: [],
    },
  },
  {
    collection: "chats",
    timestamps: { createdAt: true, updatedAt: true },
  }
);

schema.contacts = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    nickName: {
      type: String,
      required: true
    },
    contactPhoneNo: {
      type: Number,
      required: true
    },
    contactUserId: {
      type: String,
      required: true
    },
    chatId: {
      type: String,
    },
    lastMessageInfo: {
      type: message,
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  {
    collection: "contacts",
    timestamps: { createdAt: true, updatedAt: true },
  }
);

schema.users = mongoose.Schema(
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
    profilePic: {
      type: String,
      default: '',
    }
  },
  {
    collection: "users",
    timestamps: { createdAt: true, updatedAt: true },
  }
);

// schema.activeChats = mongoose.Schema(
//   {
//     userId: {
//       type: String,
//       required: true,
//     },
//     nickName: {
//       type: String,
//       required: true,
//     },
//     chatId: {
//       type: String,
//       required: true
//     },
//     lastMessageInfo: {
//       type: message,
//       required: true
//     }
//   },
//   {
//     collection: "activeChats",
//     timestamps: { createdAt: true, updatedAt: true },
//   }
// )

module.exports = schema;
