import express from "express";
import MindMap from "../models/MindMap.js"; // Assuming MindMap model is also an ES module

const router = express.Router();

// Save mind map
router.post("/", async (req, res) => {
  try {
    const mindMap = await MindMap.create(req.body);
    res.status(201).json(mindMap);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Load mind map
router.get("/:id", async (req, res) => {
  try {
    const mindMap = await MindMap.findById(req.params.id);
    res.json(mindMap);
  } catch (error) {
    res.status(404).json({ error: "Mind map not found" });
  }
});

export default router;
