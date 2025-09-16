// src/db.js

// Load database from localStorage, or create default
const savedData = localStorage.getItem("db");
export let db = savedData
  ? JSON.parse(savedData)
  : {
      incidents: [],     // Stores incident reports
      ads: [],           // Stores ads
      community: [],     // Community posts
      news: [],          // News updates
      localEvents: [],   // Local events/business
    };

// Function to save database and persist to localStorage
export function saveDB(newDB) {
  db = { ...newDB };
  localStorage.setItem("db", JSON.stringify(db));
  console.log("Database saved:", db);
}
