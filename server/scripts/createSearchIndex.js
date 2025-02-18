import { MongoClient } from "mongodb";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Verify connection string
if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in .env");
}

const uri = process.env.MONGODB_URI;

async function run() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db("knowledge-mapper");
    const collection = database.collection("bookmarks");

    // Define Atlas Search index
    const index = {
      name: "bookmarkSearch",
      definition: {
        mappings: {
          dynamic: true,
          fields: {
            title: { type: "string", analyzer: "lucene.standard" },
            description: { type: "string", analyzer: "lucene.standard" },
            tags: { type: "string", analyzer: "lucene.standard" },
          },
        },
      },
    };

    // Create search index
    const result = await collection.createSearchIndex(index);
    console.log("Search index created:", result);
  } catch (error) {
    console.error("Error creating search index:", error);
  } finally {
    await client.close();
  }
}

run().catch(console.error);
