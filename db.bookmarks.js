db.bookmarks.createIndex(
    { title: "text", description: "text", tags: "text" },
    { weights: { title: 3, tags: 2, description: 1 }, name: "bookmarkSearch" }
  )