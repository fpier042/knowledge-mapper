import { useState, useEffect } from 'react';
import EditBookmarkForm from './EditBookmarkForm'; // Import the EditBookmarkForm component

function BookmarkList({ userId }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBookmark, setEditingBookmark] = useState(null); // Track the bookmark being edited

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await fetch('http://localhost:5005/api/bookmarks', {
          headers: {
            'Authorization': 'Bearer dev-token'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch bookmarks');
        }
        
        const data = await response.json();
        setBookmarks(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5002/api/bookmarks/${id}`, { // Consider using an environment variable or proxy for the URL
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Error deleting bookmark');
      }
      setBookmarks(bookmarks.filter((bookmark) => bookmark._id!== id));
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  };

  const handleUpdate = async (id, updatedBookmark) => {
    try {
      const response = await fetch(`http://localhost:5002/api/bookmarks/${id}`, { // Consider using an environment variable or proxy for the URL
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedBookmark),
      });
      if (!response.ok) {
        throw new Error('Error updating bookmark');
      }
      const data = await response.json();
      setBookmarks(bookmarks.map((bookmark) => (bookmark._id === id? data: bookmark)));
      setEditingBookmark(null); // Exit edit mode
    } catch (error) {
      console.error('Error updating bookmark:', error);
    }
  };

  if (loading) return <div>Loading bookmarks...</div>;
  if (error) return <div>Error: {error}</div>;
  if (bookmarks.length === 0) return <div>No bookmarks found.</div>;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Bookmarks</h2>
      <div className="grid gap-4">
        {bookmarks.map((bookmark) => (
          <div key={bookmark._id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-2">
              {bookmark.favicon && (
                <img 
                  src={bookmark.favicon} 
                  alt="" 
                  className="w-4 h-4"
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
              <h3 className="text-lg font-semibold">
                <a 
                  href={bookmark.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  {bookmark.title}
                </a>
              </h3>
            </div>
            {bookmark.description && (
              <p className="text-gray-600 mt-2">{bookmark.description}</p>
            )}
            {bookmark.tags && bookmark.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {bookmark.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="text-gray-400 text-sm mt-2">
              Added: {new Date(bookmark.createdAt).toLocaleDateString()}
            </div>
            <button onClick={() => setEditingBookmark(bookmark._id)}>Edit</button>
            <button onClick={() => handleDelete(bookmark._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookmarkList;