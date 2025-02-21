import mongoose from "mongoose";
import dotenv from "dotenv";
import Bookmark from "../models/Bookmark.js";

// Load environment variables
dotenv.config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Create the Atlas Search index if it doesn't exist
    const indexExists = await Bookmark.collection.indexExists("bookmarkSearch");
    if (!indexExists) {
      await Bookmark.collection.createIndex(
        {
          title: "text",
          description: "text",
          tags: "text",
        },
        {
          weights: {
            title: 3,
            tags: 2,
            description: 1,
          },
          name: "bookmarkSearch",
        }
      );
      console.log("Atlas Search index created");
    } else {
      console.log("Atlas Search index already exists");
    }
  } catch (error) {
    console.error("Error creating Atlas Search index:", error);
  } finally {
    await mongoose.disconnect();
  }
}

run().catch(console.error);
