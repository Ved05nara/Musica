import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLikedSongs } from './LikedSongsContext'; // Import the "Brain"

const SongItem = ({ song, onPress }) => {
  // 1. Get the global list and the toggle function
  const { likedSongs, toggleLike } = useLikedSongs();

  // 2. Check if THIS song is already in the favorites list
  const isLiked = likedSongs.some((savedSong) => savedSong.id === song.id);

  return (
    <TouchableOpacity style={styles.songRow} onPress={onPress}>
      {/* Album Art */}
      <Image 
        source={{ uri: song.img }} 
        style={styles.thumbnail} 
      />
      
      {/* Text Info */}
      <View style={styles.textContainer}>
        <Text style={styles.songTitle}>{song.title}</Text>
        <Text style={styles.artistName}>{song.artist}</Text>
      </View>

      {/* Heart Icon - Toggles Global State */}
      <TouchableOpacity 
        onPress={() => toggleLike(song)} 
        style={styles.iconButton}
      >
        <Ionicons 
          name={isLiked ? "heart" : "heart-outline"} 
          size={28} 
          color={isLiked ? "#1DB954" : "#aaaaaa"} // Green if liked, Grey if not
        />
      </TouchableOpacity>

      {/* Play Icon - Just visual for now */}
      <View style={styles.iconButton}>
        <Ionicons name="play-circle" size={32} color="#fff" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  songRow: { 
    flexDirection: 'row', 
    padding: 15, 
    marginHorizontal: 15,
    marginBottom: 10,
    alignItems: 'center', 
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
  },
  thumbnail: { 
    width: 55, 
    height: 55, 
    borderRadius: 6 
  },
  textContainer: { 
    flex: 1, 
    marginLeft: 15 
  },
  songTitle: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  artistName: { 
    color: '#aaa', 
    fontSize: 13, 
    marginTop: 2 
  },
  iconButton: {
    marginLeft: 10, 
  }
});

export default SongItem;