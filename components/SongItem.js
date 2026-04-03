import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLikedSongs } from './LikedSongsContext';

const SongItem = ({ song, onPress }) => {
  const { likedSongs, toggleLike } = useLikedSongs();
  const isLiked = likedSongs.some((savedSong) => savedSong.id === song.id);

  // 1. Setup Animation Values
  const fadeAnim = useRef(new Animated.Value(0)).current; // Starts invisible (0)
  const scaleAnim = useRef(new Animated.Value(1)).current; // Starts normal size (1)

  // 2. Fade In on Mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500, // Half a second fade
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // 3. Scale Animation for the Heart Click
  const handleLikePress = () => {
    toggleLike(song);
    
    // Sequence: Pop up to 1.3x size, then back to 1x
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.3, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true })
    ]).start();
  };

  return (
    // Change to Animated.View to apply the fade
    <Animated.View style={[styles.songRow, { opacity: fadeAnim }]}>
      <TouchableOpacity style={styles.touchableArea} onPress={onPress}>
        <Image source={{ uri: song.img }} style={styles.thumbnail} />
        <View style={styles.textContainer}>
          <Text style={styles.songTitle} numberOfLines={1}>{song.title}</Text>
          <Text style={styles.artistName} numberOfLines={1}>{song.artist}</Text>
        </View>
      </TouchableOpacity>

      {/* Change to Animated.View to apply the scale */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity onPress={handleLikePress} style={styles.iconButton}>
          <Ionicons 
            name={isLiked ? "heart" : "heart-outline"} 
            size={28} 
            color={isLiked ? "#1DB954" : "#aaaaaa"} 
          />
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  songRow: { flexDirection: 'row', padding: 15, marginHorizontal: 15, marginBottom: 10, alignItems: 'center', backgroundColor: '#1e1e1e', borderRadius: 12 },
  touchableArea: { flexDirection: 'row', flex: 1, alignItems: 'center' },
  thumbnail: { width: 55, height: 55, borderRadius: 6, backgroundColor: '#333' },
  textContainer: { flex: 1, marginLeft: 15, paddingRight: 10 },
  songTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  artistName: { color: '#aaa', fontSize: 13, marginTop: 2 },
  iconButton: { marginLeft: 10, padding: 5 }
});

export default SongItem;