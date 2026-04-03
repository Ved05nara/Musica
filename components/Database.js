import { Platform } from 'react-native';

// 1. Open or create the database file on the phone
let db = null;

if (Platform.OS !== 'web') {
  try {
    const SQLite = require('expo-sqlite');
    db = SQLite.openDatabaseSync('musica.db');
  } catch (error) {
    console.error('Failed to open database:', error);
  }
}

// 2. Initialize the Tables (The Blueprint)
export const initDatabase = async () => {
  if (Platform.OS === 'web' || !db) {
    console.log("Database initialization skipped (web or unavailable)");
    return;
  }
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS recently_played (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        song_id TEXT NOT NULL,
        title TEXT NOT NULL,
        artist TEXT NOT NULL,
        img TEXT NOT NULL,
        played_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('SQLite Database initialized!');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// 3. Helper function to add a song to the history
export const logSongPlay = async (song) => {
  if (!db) {
    console.warn('Database not available');
    return;
  }
  try {
    await db.runAsync(
      'INSERT INTO recently_played (song_id, title, artist, img) VALUES (?, ?, ?, ?)',
      song.id, song.title, song.artist, song.img
    );
    console.log(`Saved ${song.title} to play history.`);
  } catch (error) {
    console.error('Error logging song:', error);
  }
};