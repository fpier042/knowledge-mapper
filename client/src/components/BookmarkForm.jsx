import { useState } from "react";

function BookmarkForm({ userId }) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Updated port from 5002 to 5005
      const response = await fetch("http://localhost:5005/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer dev-token", // Using our dev token
        },
        body: JSON.stringify({
          url,
          title,
          description,
          tags: tags.split(",").map((tag) => tag.trim()),
          userId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Bookmark added:", data);
        // Clear form
        setUrl("");
        setTitle("");
        setDescription("");
        setTags("");
      } else {
        const error = await response.json();
        console.error("Error:", error);
      }
    } catch (error) {
      console.error("Error adding bookmark:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 bg-white rounded shadow">
      <div className="mb-3">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (optional)"
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-3">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma-separated)"
          className="w-full p-2 border rounded"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Bookmark
      </button>
    </form>
  );
}

export default BookmarkForm;
