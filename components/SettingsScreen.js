import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function SettingsScreen() {
  const { logout } = useAuth();
  const { theme, isDarkMode, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
      
      {/* Theme Toggle Section */}
      <View style={[styles.section, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Theme</Text>
        <View style={styles.themeOption}>
          <Text style={[styles.optionLabel, { color: theme.text }]}>
            {isDarkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#ccc', true: '#1DB954' }}
            thumbColor={isDarkMode ? '#1DB954' : '#fff'}
          />
        </View>
      </View>

      {/* App Info Section */}
      <View style={[styles.section, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>App Info</Text>
        <Text style={[styles.infoText, { color: theme.textSecondary }]}>Version 1.0.0</Text>
      </View>

      {/* Logout Button */}
      <TouchableOpacity 
        style={[styles.logoutButton, { backgroundColor: theme.card }]} 
        onPress={logout}
      >
        <Text style={[styles.logoutText, { color: theme.error }]}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'stretch', 
    justifyContent: 'flex-start', 
    paddingTop: 20 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    paddingHorizontal: 20, 
    marginBottom: 20 
  },
  section: {
    marginVertical: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  themeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  infoText: {
    fontSize: 14,
  },
  logoutButton: { 
    marginTop: 30,
    marginHorizontal: 20,
    paddingVertical: 12, 
    paddingHorizontal: 24, 
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: { 
    fontSize: 16, 
    fontWeight: '600' 
  },
});