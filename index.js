"use strict";

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// io.on("connection", (socket) => {
//   socket.broadcast.emit("hi");
// });

io.on("connection", (socket) => {
  socket.on("chat message", (nickname) => {
    io.emit("chat message", nickname);
  });
});

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    socket.broadcast.emit("chat message", msg);
  });
});

//when socket is connected
io.on("connection", (socket) => {
  console.log("Yay, connection was recorded");

  //emit message to all front-end clients
  socket.on("connect", (nickname) => {
    io.emit("chat message", `${nickname} is online!`);
  });

  //handling disconnects
  socket.on("disconnect", () => {
    io.emit("chat message", "some user disconnected");
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
