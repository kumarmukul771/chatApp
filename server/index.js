const express = require("express");
const app = express();
const http = require("http");
const socketio = require("socket.io");
const port = process.env.POST || 5000;
const server = http.createServer(app);
const io = socketio(server);
const router = require("./router");
const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");

app.use(router);

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    console.log(error, user);

    if (error) return callback(error);

    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to the room ${user.room}`,
    });

    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name}, has joined.` });

    socket.join(user.room);

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    // Here in callback we can actually trigger some response immediately after this socket.on event is
    // being emitted and then we reuqest it here.here in callback we can do error handling.
    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", { user: user.name, text: message });

    callback();
  });

  socket.on("disconnect", () => {
    console.log("User has disconnected", socket.id);
    const user = removeUser(socket.id);

    console.log(user);

    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left.`,
      });

      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});
server.listen(port, () => {
  console.log(`Server has started at${port}`);
});
