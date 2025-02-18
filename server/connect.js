import { MongoClient } from "mongodb";

// Replace the following with your Atlas connection string
const url =
  "mongodb+srv://fpier042:<Dessalines90>@bookmark-mind-mapping.6oboh.mongodb.net/?retryWrites=true&w=majority&appName=bookmark-mind-mapping";

// Connect to your Atlas cluster
const client = new MongoClient(url);

async function run() {
  try {
    await client.connect();
    console.log("Successfully connected to Atlas");
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
