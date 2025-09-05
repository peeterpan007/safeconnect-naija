// src/db.js

// Mock database
export let db = {
  incidents: [],     // Stores incident reports
  ads: [],           // Stores ads
  community: [],     // Stores community chat posts
  news: [],          // Stores news updates
  localEvents: [],   // Stores local events/business
};

// Function to save database (in-memory for now)
export function saveDB(newDB) {
  db = { ...newDB };
  console.log("Database saved:", db);
}
