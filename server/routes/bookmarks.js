import express from "express";
import Bookmark from "../models/Bookmark.js"; // Assuming Bookmark model is also an ES module

const router = express.Router();

// POST /api/bookmarks - Create new bookmark
router.post("/", async (req, res) => {
  try {
    const { url, title, description, tags } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const bookmark = new Bookmark({
      url,
      title: title || url,
      description: description || "",
      tags: tags || [],
      user: "temp-user", // Temporary until auth implementation
    });

    const savedBookmark = await bookmark.save();
    res.status(201).json(savedBookmark);
  } catch (error) {
    console.error("Error saving bookmark:", error);
    res.status(500).json({ error: "Server error while saving bookmark" });
  }
});

// GET /api/bookmarks - Get all bookmarks (or handle search if query is present)
router.get("/", async (req, res) => {
  if (req.query.query) {
    // Check if a search query is provided
    try {
      const results = await Bookmark.aggregate([
        {
          $search: {
            index: "bookmarkSearch", // Make sure this index exists in MongoDB Atlas
            compound: {
              should: [
                { text: { query: req.query.query, path: "title", fuzzy: {} } },
                {
                  text: {
                    query: req.query.query,
                    path: "description",
                    fuzzy: {},
                  },
                },
                { text: { query: req.query.query, path: "tags", fuzzy: {} } },
              ],
            },
          },
        },
        { $limit: 20 },
        { $project: { _id: 1, title: 1, url: 1, description: 1 } }, // Project only necessary fields
      ]);
      res.json(results);
    } catch (error) {
      console.error("Search error:", error); // Log the error for debugging
      res.status(500).json({ error: "Search failed" });
    }
  } else {
    // If no query, return all bookmarks
    try {
      const bookmarks = await Bookmark.find().sort({ createdAt: -1 });
      res.json(bookmarks);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      res.status(500).json({ error: "Server error while fetching bookmarks" });
    }
  }
});

export default router;
