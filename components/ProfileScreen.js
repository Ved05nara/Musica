import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

let ImagePicker = null;
let Location = null;

if (Platform.OS !== 'web') {
  ImagePicker = require('expo-image-picker');
  Location = require('expo-location');
}

export default function ProfileScreen() {
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState('Listening from online');
  const [loadingLoc, setLoadingLoc] = useState(true);

  // 1. Fetch GPS Location on Mount (only on native)
  useEffect(() => {
    if (Platform.OS === 'web') {
      setLoadingLoc(false);
      return;
    }

    (async () => {
      try {
        // Request permission to use GPS
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocation('Location access denied');
          setLoadingLoc(false);
          return;
        }

        try {
          // Grab the raw coordinates
          let currentPosition = await Location.getCurrentPositionAsync({});
          
          // Translate coordinates into a readable City/State
          let geocode = await Location.reverseGeocodeAsync({
            latitude: currentPosition.coords.latitude,
            longitude: currentPosition.coords.longitude,
          });

          if (geocode.length > 0) {
            const city = geocode[0].city || geocode[0].district || 'Unknown City';
            setLocation(`Listening from ${city}`);
          } else {
            setLocation('Location unavailable');
          }
        } catch (error) {
          console.error(error);
          setLocation('Listening from Mumbai'); // Fallback 
        }
      } catch (error) {

        console.error('Location error:', error);
        setLocation('Listening from Mumbai');
      } finally {
        setLoadingLoc(false);
      }
    })();
  }, []);

  // 2. Open Gallery and Pick Image (only on native)
  const pickImage = async () => {
    if (Platform.OS === 'web' || !ImagePicker) {
      alert('Image picker is not available on web');
      return;
    }

    try {
      // Request permission to access the camera roll
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to update your avatar!');
        return;
      }

      // Launch the native image gallery
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Forces a square crop perfect for avatars
        quality: 0.8,     // Compresses slightly for better performance
      });

      // If the user picked an image (didn't cancel), save it to state
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      alert('Error selecting image');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Profile</Text>
      </View>

      <View style={styles.profileSection}>
        {/* Interactive Avatar */}
        <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="camera" size={40} color="#888" />
            </View>
          )}
          <View style={styles.editBadge}>
            <Ionicons name="pencil" size={14} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Profile Info */}
        <Text style={styles.name}>Vedant Narayan</Text>
        <Text style={styles.bio}>BTech @ KJ Somaiya | Music Enthusiast</Text>
        
        {/* GPS Location Tag */}
        <View style={styles.locationTag}>
          <Ionicons name="location" size={16} color="#1DB954" />
          {loadingLoc ? (
            <ActivityIndicator size="small" color="#1DB954" style={{ marginLeft: 5 }} />
          ) : (
            <Text style={styles.locationText}>{location}</Text>
          )}
        </View>
      </View>

      {/* Stats Board */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>124</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Playlists</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  headerTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  profileSection: { alignItems: 'center', marginTop: 20 },
  imageContainer: { position: 'relative', marginBottom: 15 },
  avatar: { width: 120, height: 120, borderRadius: 60 },
  avatarPlaceholder: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#2a2a2a', alignItems: 'center', justifyContent: 'center' },
  editBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#1DB954', padding: 8, borderRadius: 20, borderWidth: 3, borderColor: '#121212' },
  name: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  bio: { color: '#aaa', fontSize: 14, marginBottom: 15 },
  locationTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e1e1e', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  locationText: { color: '#1DB954', marginLeft: 5, fontSize: 14, fontWeight: '600' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 40, borderTopWidth: 1, borderTopColor: '#2a2a2a', paddingTop: 30 },
  statBox: { alignItems: 'center' },
  statNumber: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  statLabel: { color: '#888', fontSize: 12, marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 },
});