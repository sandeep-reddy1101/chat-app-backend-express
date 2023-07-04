const socketMappingMethods = require("../models/socketIdMapping");

const handleSocketEvents = (io) => {
    io.on("connection", (socket) => {
      console.log("client connected >>> ", socket.id)
        socket.on("map socketId", (userId) => {
            console.log("userId >>> ", userId);
            console.log("socketID >>> ", socket.id);
            socketMappingMethods.createNewMapping(userId, socket.id).then((response) => {
              if(response){
                console.log("mapping success sent to client")
                socket.emit("mapping_success", "mapping successfull")
              }else {
                socket.emit("mapping_failed", "mapping failed")
              }
            }).catch(err => {
              console.log(err)
            })
        })
        
        // Event handler for 'message' event from the client
        socket.on("send message", (messageData) => {
          console.log("Received message:", messageData);
          socket.emit("message", "Hi from server");
          socket.broadcast.emit("broadcast", "hi from server")
        });
      
        // Event handler for disconnection
        socket.on("disconnect", () => {
          console.log("A client disconnected.");
          socketMappingMethods.deleteSocketIdFromMapping(socket.id).then((response) => {
            if(response){
              console.log("mapping deleted")
            }else{
              console.log("mapping deleted")
            }
          }).catch(err => {
            console.log("mapping deletion failed >>> ", err.message)
            console.log(err)
          })
        });
        
      });
}

module.exports = handleSocketEvents
