import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function DetailScreen({ route }) {
  const { song } = route.params; // Get the song data passed via navigation
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Image source={{ uri: song.img }} style={styles.largeArt} />
      <Text style={[styles.title, { color: theme.text }]}>{song.title}</Text>
      <Text style={[styles.artist, { color: theme.accent }]}>{song.artist}</Text>
      <Text style={[styles.status, { color: theme.textSecondary }]}>Now Playing...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  largeArt: { width: 300, height: 300, borderRadius: 20, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  artist: { fontSize: 18, marginTop: 10 },
  status: { marginTop: 30, fontStyle: 'italic' }
});