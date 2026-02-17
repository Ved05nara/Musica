import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import SongItem from './SongItem'; // Import the component

export default function Homescreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [songs] = useState([
    { id: '1', title: 'Gehra Hua', artist: 'Arijit Singh', img: 'https://picsum.photos/200' },
    { id: '2', title: 'Kun Faya Kun', artist: 'AR Rahman, Javed Ali', img: 'https://picsum.photos/201' },
    { id: '3', title: 'Tu Hi Meri Shab Hai', artist: 'KK', img: 'https://picsum.photos/202' },
    { id: '4', title: 'Tum Hi Ho', artist: 'Arijit Singh', img: 'https://picsum.photos/203' },
    { id: '5', title: 'Bezubaan', artist: 'Mohit Chauhan', img: 'https://picsum.photos/204' },
  ]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.input}
            placeholder="Search songs..."
            placeholderTextColor="#888"
            value={search}
            onChangeText={(text) => setSearch(text)}
          />
        </View>

        {songs
          .filter((item) => item.title.toLowerCase().includes(search.toLowerCase()))
          .map((item) => (
            // --- THE IMPORTANT CHANGE IS HERE ---
            <SongItem
              key={item.id} 
              song={item} // We pass the WHOLE item object as 'song'
              onPress={() => navigation.navigate('Details', { song: item })}
            />
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  searchBox: { paddingHorizontal: 20, marginVertical: 20 },
  input: { backgroundColor: '#222', color: '#fff', padding: 15, borderRadius: 10, fontSize: 16 },
});