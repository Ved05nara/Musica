import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useLikedSongs } from './LikedSongsContext';
import { useTheme } from '../context/ThemeContext';
import SongItem from './SongItem';

export default function LikedSongs({ navigation }) {
    const { likedSongs } = useLikedSongs();
    const { theme } = useTheme();

    const handleSongPress = (song) => {
        // Navigate from Drawer -> HomeTabs (Drawer screen) -> MusicFlow (Tab) -> Details (Stack)
        navigation.navigate('HomeTabs', {
            screen: 'MusicFlow',
            params: {
                screen: 'Details',
                params: { song }
            }
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.header, { color: theme.text }]}>Your Favorites</Text>
            
            {likedSongs.length === 0 ? (
                <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No liked songs yet. Go add some!</Text>
            ) : (
                <FlatList
                    data={likedSongs}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <SongItem 
                            song={item} 
                            onPress={() => handleSongPress(item)}
                        />
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 50 },
    header: { fontSize: 24, fontWeight: 'bold', marginLeft: 20, marginBottom: 20 },
    emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16 }
});