import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import config from "./config/config.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import bookmarkRoutes from "./routes/bookmarks.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: config.allowedOrigins,
    credentials: true,
  },
});

const PORT = process.env.PORT || 5003;

// Middleware
app.use(
  cors({
    origin: config.allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/bookmarks", bookmarkRoutes);

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("updateMindMap", (data) => {
    // You might want to add logic here to validate or process the data
    socket.broadcast.emit("mindMapUpdated", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

// MongoDB connection with retry logic
const connectWithRetry = async () => {
  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      await mongoose.connect(config.mongoUri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      console.log("Connected to MongoDB successfully");
      break; // Exit the loop if the connection is successful
    } catch (error) {
      retries++;
      console.error(
        `MongoDB connection attempt ${retries} failed:`,
        error.message
      );
      if (retries === maxRetries) {
        console.error("Failed to connect to MongoDB after multiple attempts");
        process.exit(1); // Exit the process if all retries fail
      }
      // Exponential backoff for retrying
      await new Promise((resolve) =>
        setTimeout(resolve, Math.min(1000 * Math.pow(2, retries), 10000))
      );
    }
  }
};

connectWithRetry()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Server failed to start:", error);
    process.exit(1);
  });
