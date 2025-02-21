import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, "URL is required"],
      trim: true,
      validate: {
        validator: function (v) {
          try {
            new URL(v);
            return true;
          } catch (err) {
            return false;
          }
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },
    title: {
      type: String,
      default: function () {
        return this.url; // Default to URL if title not provided
      },
    },
    description: String,
    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Indexes for faster searching
bookmarkSchema.index({ url: 1 });
bookmarkSchema.index({ tags: 1 });
bookmarkSchema.index({ createdAt: -1 });

// Define the text index with weights and name
bookmarkSchema.index(
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

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

export default Bookmark;