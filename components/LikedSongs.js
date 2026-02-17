import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useLikedSongs } from './LikedSongsContext';
import SongItem from './SongItem';

export default function LikedSongs({ navigation }) {
    const { likedSongs } = useLikedSongs();

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Your Favorites</Text>
            
            {likedSongs.length === 0 ? (
                <Text style={styles.emptyText}>No liked songs yet. Go add some!</Text>
            ) : (
                <FlatList
                    data={likedSongs}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <SongItem 
                            song={item} 
                            onPress={() => navigation.navigate('Details', { song: item })}
                        />
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212', paddingTop: 50 },
    header: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginLeft: 20, marginBottom: 20 },
    emptyText: { color: '#888', textAlign: 'center', marginTop: 50, fontSize: 16 }
});