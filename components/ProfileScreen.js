import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} 
        style={styles.avatar} 
      />
      <Text style={styles.name}>Vedant Narayan</Text>
      <Text style={styles.bio}>Music Lover & App Developer</Text>
      
      <View style={styles.statRow}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>125</Text>
          <Text style={styles.statLabel}>Songs</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>14</Text>
          <Text style={styles.statLabel}>Playlists</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', alignItems: 'center', paddingTop: 80 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 20, borderWidth: 2, borderColor: '#1DB954' },
  name: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  bio: { color: '#aaa', fontSize: 16, marginTop: 5 },
  statRow: { flexDirection: 'row', marginTop: 30, width: '80%', justifyContent: 'space-around' },
  stat: { alignItems: 'center' },
  statNumber: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  statLabel: { color: '#888', fontSize: 14 },
});