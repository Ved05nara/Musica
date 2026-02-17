import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

import { LikedSongsProvider } from "./components/LikedSongsContext";
import Homescreen from "./components/HomeScreen";
import DetailScreen from "./components/DetailScreen";
import ProfileScreen from "./components/ProfileScreen";
import SettingsScreen from "./components/SettingsScreen";
import LikedSongs from "./components/LikedSongs";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function MusicStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#121212" },
        headerTintColor: "#fff",
      }}
    >
      <Stack.Screen
        name="Library"
        component={Homescreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Details"
        component={DetailScreen}
        options={{ title: "Now Playing" }}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: "#121212", borderTopColor: "#333" },
        tabBarActiveTintColor: "#1DB954",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "MusicFlow") {
            iconName = focused ? "musical-notes" : "musical-notes-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* The first tab is our Music Stack */}
      <Tab.Screen
        name="MusicFlow"
        component={MusicStack}
        options={{ title: "Music" }}
      />

      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <LikedSongsProvider>
      <NavigationContainer>
        <Drawer.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: "#121212" },
            headerTintColor: "#fff",
            drawerStyle: { backgroundColor: "#1e1e1e", width: 240 },
            drawerActiveTintColor: "#1DB954",
            drawerInactiveTintColor: "#fff",
          }}
        >
          {/* The Main App lives in the first drawer item */}
          <Drawer.Screen
            name="HomeTabs"
            component={MainTabs}
            options={{ title: "Musica 🎵" }}
          />

          {/* Secondary Drawer items */}
          <Drawer.Screen name="Settings" component={SettingsScreen} />
          <Drawer.Screen name="Liked Songs" component={LikedSongs} />
        </Drawer.Navigator>
      </NavigationContainer>
    </LikedSongsProvider>
  );
}
