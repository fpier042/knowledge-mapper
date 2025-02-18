import { io } from "socket.io-client";

const socket = io("http://localhost:5001");

export const connectSocket = () => {
  socket.connect();
};

export const onMindMapUpdate = (callback) => {
  socket.on("mindMapUpdated", callback);
};

export const emitMindMapUpdate = (data) => {
  socket.emit("updateMindMap", data);
};
