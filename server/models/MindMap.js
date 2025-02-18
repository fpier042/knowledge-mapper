import mongoose from "mongoose";

const mindMapSchema = new mongoose.Schema({
  name: String,
  nodes: [
    {
      id: String,
      position: { x: Number, y: Number },
      data: {
        label: String,
        bookmark: { type: mongoose.Schema.Types.ObjectId, ref: "Bookmark" },
      },
    },
  ],
  edges: [
    {
      source: String,
      target: String,
      label: String,
    },
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const MindMap = mongoose.model("MindMap", mindMapSchema);

export default MindMap;
