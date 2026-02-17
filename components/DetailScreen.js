import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function DetailScreen({ route }) {
  const { song } = route.params; // Get the song data passed via navigation

  return (
    <View style={styles.container}>
      <Image source={{ uri: song.img }} style={styles.largeArt} />
      <Text style={styles.title}>{song.title}</Text>
      <Text style={styles.artist}>{song.artist}</Text>
      <Text style={styles.status}>Now Playing...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', alignItems: 'center', justifyContent: 'center' },
  largeArt: { width: 300, height: 300, borderRadius: 20, marginBottom: 20 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  artist: { color: '#1DB954', fontSize: 18, marginTop: 10 },
  status: { color: '#888', marginTop: 30, fontStyle: 'italic' }
});