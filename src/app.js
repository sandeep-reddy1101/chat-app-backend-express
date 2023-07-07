require("dotenv").config();
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const bodyparser = require("body-parser");
const cors = require("cors");
// const hpp = require("hpp");
// const xss = require("xss");
// const helmet = require("helmet");

const userRouter = require("./routes/userRouter");
const contactsRouter = require('./routes/contactsRouter');
const chatsRouter = require("./routes/chatRouter");
const handleSocketEvents = require('./routes/socketEvents');

const port = process.env.PORT || 4100;

const app = express();

// app.use(hpp());
// app.use(xss());
// app.use(helmet());
app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

const httpServer = http.createServer(app);

app.use('/users', userRouter);
app.use('/contacts', contactsRouter);
app.use('/chats', chatsRouter);

const socketOptions = {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
};
const io = socketIO(httpServer, socketOptions);

// Handling all socket events
handleSocketEvents(io)

httpServer.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
