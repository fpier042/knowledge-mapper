import express from "express";
import Bookmark from "../models/Bookmark.js"; // Assuming Bookmark model is also an ES module

const router = express.Router();

// Search bookmarks
router.post("/", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || query.trim().length < 2) {
      return res
        .status(400)
        .json({ error: "Query must be at least 2 characters" });
    }

    const results = await Bookmark.aggregate([
      {
        $search: {
          index: "bookmarkSearch",
          compound: {
            should: [
              { text: { query, path: "title", fuzzy: {} } },
              { text: { query, path: "description", fuzzy: {} } },
              { text: { query, path: "tags", fuzzy: {} } },
            ],
            minimumShouldMatch: 1,
          },
        },
      },
      { $limit: 20 },
      { $project: { _id: 1, title: 1, url: 1, description: 1, tags: 1 } },
    ]);

    res.json(results);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Search failed" });
  }
});

export default router;
