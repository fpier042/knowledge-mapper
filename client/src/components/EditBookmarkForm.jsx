// client/src/components/EditBookmarkForm.jsx
import { useState } from 'react';

const EditBookmarkForm = ({ bookmark, onUpdate, onCancel }) => {
  const [title, setTitle] = useState(bookmark.title);
  const [url, setUrl] = useState(bookmark.url);
  const [tags, setTags] = useState(bookmark.tags.join(', '));
  const [description, setDescription] = useState(bookmark.description);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(bookmark._id, {
      title,
      url,
      tags: tags.split(',').map((tag) => tag.trim()),
      description,
      favicon: bookmark.favicon, // Preserve the existing favicon
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="url"
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Tags (comma-separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default EditBookmarkForm;