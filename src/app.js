require("dotenv").config();
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const bodyparser = require("body-parser");
const cors = require("cors");

const userRouter = require("./routes/userRouter");
const contactsRouter = require('./routes/contactsRouter');

const port = process.env.PORT || 4100;

const app = express();

app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

const httpServer = http.createServer(app);

app.use('/users', userRouter);
app.use('/contacts', contactsRouter);

const socketOptions = {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
};
const io = socketIO(httpServer, socketOptions);

io.on("connection", (socket) => {
  console.log("A client connected. >>> ", socket.id);

  // Event handler for 'message' event from the client
  socket.on("message", (message) => {
    console.log("Received message:", message);
    socket.emit("message", "Hi from server");
  });

  // Event handler for disconnection
  socket.on("disconnect", () => {
    console.log("A client disconnected.");
  });
});

httpServer.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
