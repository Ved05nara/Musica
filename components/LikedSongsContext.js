import React, { createContext, useState, useContext } from 'react';

const LikedSongsContext = createContext();

export const LikedSongsProvider = ({ children }) => {
  const [likedSongs, setLikedSongs] = useState([]);

  const toggleLike = (song) => {
    setLikedSongs((prevSongs) => {
      const isAlreadyLiked = prevSongs.some((s) => s.id === song.id);
      if (isAlreadyLiked) {
        // Remove if already liked
        return prevSongs.filter((s) => s.id !== song.id);
      } else {
        // Add if not liked
        return [...prevSongs, song];
      }
    });
  };

  return (
    <LikedSongsContext.Provider value={{ likedSongs, toggleLike }}>
      {children}
    </LikedSongsContext.Provider>
  );
};

export const useLikedSongs = () => useContext(LikedSongsContext);