import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LikedContext = createContext();

export function LikedProvider({ children }) {
  const [likedSongs, setLikedSongs] = useState([]);

  // 1. Load songs from the phone's memory when the app starts
  useEffect(() => {
    const loadLikedSongs = async () => {
      try {
        const savedSongs = await AsyncStorage.getItem('@liked_songs');
        if (savedSongs !== null) {
          setLikedSongs(JSON.parse(savedSongs));
        }
      } catch (error) {
        console.error("Failed to load liked songs:", error);
      }
    };
    loadLikedSongs();
  }, []);

  // 2. Toggle likes AND save to phone memory
  const toggleLike = async (song) => {
    try {
      let updatedSongs;
      const isAlreadyLiked = likedSongs.some((s) => s.id === song.id);

      if (isAlreadyLiked) {
        updatedSongs = likedSongs.filter((s) => s.id !== song.id); // Remove
      } else {
        updatedSongs = [...likedSongs, song]; // Add
      }

      setLikedSongs(updatedSongs); // Update UI
      await AsyncStorage.setItem('@liked_songs', JSON.stringify(updatedSongs)); // Save to Disk

    } catch (error) {
      console.error("Failed to save liked songs:", error);
    }
  };

  return (
    <LikedContext.Provider value={{ likedSongs, toggleLike }}>
      {children}
    </LikedContext.Provider>
  );
}

export function useLikedSongs() {
  return useContext(LikedContext);
}