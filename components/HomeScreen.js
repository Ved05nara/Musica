import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput, ActivityIndicator, Text } from 'react-native';
import SongItem from './SongItem';

export default function Homescreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const artists = ['arijit+singh', 'shreya+ghoshal', 'atif+aslam', 'ed+sheeran', 'armaan+malik', 'the+weeknd', 'dua+lipa', 'justin+bieber', 'eminem', 'coldplay'];
        const fetchPromises = artists.map((artist) =>
          fetch(`https://itunes.apple.com/search?term=${artist}&media=music&limit=5`)
            .then((res) => res.json())
        );
        const results = await Promise.all(fetchPromises);
        
        const combinedTracks = results.flatMap(data => data.results);
        
        const formattedSongs = combinedTracks.map((track) => ({
          id: track.trackId.toString(),
          title: track.trackName,
          artist: track.artistName,
          img: track.artworkUrl100.replace('100x100bb', '600x600bb') 
        }));
        const shuffled = formattedSongs.sort(() => 0.5 - Math.random());
        setSongs(shuffled);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchMusic();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.input}
            placeholder="Search local list..."
            placeholderTextColor="#888"
            value={search}
            onChangeText={(text) => setSearch(text)}
          />
        </View>

        {/* Show a loading spinner while the API fetches */}
        {loading ? (
          <ActivityIndicator size="large" color="#1DB954" style={{ marginTop: 50 }} />
        ) : error ? (
          <Text style={styles.errorText}>Error: {error}</Text>
        ) : songs.length === 0 ? (
          <Text style={styles.noSongsText}>No songs found</Text>
        ) : (
          songs
            .filter((item) => item.title.toLowerCase().includes(search.toLowerCase()))
            .map((item) => (
              <SongItem
                key={item.id} 
                song={item} 
                onPress={() => navigation.navigate('Details', { song: item })}
              />
            ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  searchBox: { paddingHorizontal: 20, marginVertical: 20 },
  input: { backgroundColor: '#222', color: '#fff', padding: 15, borderRadius: 10, fontSize: 16 },
  errorText: { color: '#ff6b6b', fontSize: 16, textAlign: 'center', marginTop: 50 },
  noSongsText: { color: '#aaa', fontSize: 16, textAlign: 'center', marginTop: 50 },
});