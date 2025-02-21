import express from "express";
import Bookmark from "../models/Bookmark.js";
import authMiddleware from "../middleware/authMiddleware.js";
import scrapeMetadata from '../utils/scrapeMetadata.js';

const router = express.Router();

// Create a new bookmark (with metadata scraping)
router.post('/', authMiddleware, async (req, res) => {
  try {
    console.log('Request Body:', req.body); // Log the request body
    const { url, title, description, tags, favicon } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const { title: scrapedTitle, description: scrapedDescription, favicon: scrapedFavicon } = await scrapeMetadata(url);

    const bookmark = new Bookmark({
      url,
      title: title || scrapedTitle,
      description: description || scrapedDescription,
      tags: tags || [],
      favicon: favicon || scrapedFavicon,
      userId: req.userId
    });

    const savedBookmark = await bookmark.save();
    res.status(201).json(savedBookmark);
  } catch (error) {
    console.error("Error saving bookmark:", error);
    res.status(500).json({ message: 'Error saving bookmark', error: error.message }); // Send more detailed error info
  }
});

// Get all bookmarks for a user (with search)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.userId });
    res.status(200).json(bookmarks);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    res.status(500).json({ message: 'Error fetching bookmarks', error: error.message });
  }
});

// Update a bookmark
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, url, tags, description, favicon } = req.body;
    const bookmark = await Bookmark.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title, url, tags, description, favicon },
      { new: true, runValidators: true }
    );
    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }
    res.status(200).json(bookmark);
  } catch (error) {
    res.status(500).json({ message: 'Error updating bookmark', error: error.message });
  }
});

// Delete a bookmark
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }
    res.status(200).json({ message: 'Bookmark deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting bookmark', error: error.message });
  }
});

export default router;