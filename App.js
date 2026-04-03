import React from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useEffect } from "react";
import { initDatabase } from "./components/Database";
import { Ionicons } from "@expo/vector-icons";

import { store } from "./store";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { LikedProvider } from "./components/LikedSongsContext";
import LoginScreen from "./components/LoginScreen";
import SignUpScreen from "./components/SignUpScreen";
import Homescreen from "./components/HomeScreen";
import DetailScreen from "./components/DetailScreen";
import ProfileScreen from "./components/ProfileScreen";
import SettingsScreen from "./components/SettingsScreen";
import LikedSongs from "./components/LikedSongs";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.toString() };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212', padding: 20 }}>
          <Text style={{ color: '#ff6b6b', fontSize: 18, marginBottom: 10 }}>
            Something went wrong!
          </Text>
          <Text style={{ color: '#aaa', fontSize: 14, textAlign: 'center' }}>
            {this.state.errorMessage}
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

function MusicStack() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.surface },
        headerTintColor: theme.text,
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
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: theme.surface, borderTopColor: theme.border },
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textTertiary,
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
      <Tab.Screen
        name="MusicFlow"
        component={MusicStack}
        options={{ title: "Music" }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function MainApp() {
  const { theme } = useTheme();
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.surface },
        headerTintColor: theme.text,
        drawerStyle: { backgroundColor: theme.surface, width: 240 },
        drawerActiveTintColor: theme.accent,
        drawerInactiveTintColor: theme.text,
      }}
    >
      <Drawer.Screen
        name="HomeTabs"
        component={MainTabs}
        options={{ title: "Musica 🎵" }}
      />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Liked Songs" component={LikedSongs} />
    </Drawer.Navigator>
  );
}

function AuthStack() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.surface },
        headerTintColor: theme.text,
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { isAuthenticated, isHydrated } = useAuth();
  const { theme, isHydrated: themeHydrated } = useTheme();

  console.log('RootNavigator: Rendering', { authHydrated: isHydrated, themeHydrated, isAuthenticated });

  if (!isHydrated || !themeHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  const darkTheme = {
    dark: true,
    colors: {
      primary: '#1DB954',
      background: theme.background,
      card: theme.surface,
      text: theme.text,
      border: theme.border,
      notification: '#ff6b6b',
    },
    fonts: {
      regular: {
        fontFamily: 'System',
        fontWeight: '400',
      },
      medium: {
        fontFamily: 'System',
        fontWeight: '500',
      },
      bold: {
        fontFamily: 'System',
        fontWeight: '700',
      },
      heavy: {
        fontFamily: 'System',
        fontWeight: '800',
      },
    },
  };

  return (
    <NavigationContainer theme={darkTheme}>
      {isAuthenticated ? <MainApp /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  useEffect(() => {
    const initApp = async () => {
      try {
        await initDatabase();
        console.log('App initialization complete');
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };
    initApp();
  }, []);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider>
          <AuthProvider>
            <LikedProvider>
              <RootNavigator />
            </LikedProvider>
          </AuthProvider>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
}
