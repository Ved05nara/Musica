# Project Analysis: Where useReducer, Context API, and Redux Are Used

## 🚀 Executive Summary

Your Musica app uses a **3-layer state management system**:

1. **Redux** - Global auth state (login/signup)
2. **Context API** - Shared state without prop drilling (auth, liked songs)
3. **useReducer** - Complex local form state (login/signup forms)

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         App.js                                  │
│  - Redux Provider (wraps everything)                            │
│  - AuthProvider (Context API for login)                         │
│  - LikedSongsProvider (Context API for favorites)               │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─ Redux Store (store/index.js)
         │  └─ authSlice (reducers + async thunks)
         │
         ├─ AuthContext Provider
         │  └─ useAuth() hook
         │
         └─ LikedSongsContext Provider
            └─ useLikedSongs() hook
```

---

## 🔴 REDUX - Central Authentication State

### File: `store/index.js`
```javascript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,  // Redux manages auth state
  },
});
```

**What it does:**
- Sets up Redux store
- Registers `authReducer` under `auth` slice
- Makes store available to entire app

---

### File: `store/slices/authSlice.js`

#### 1. **Redux State Shape**
```javascript
const initialState = {
  user: null,                    // User object or null
  token: null,                   // JWT token or null
  isAuthenticated: false,        // Boolean flag
  isLoading: false,              // Loading during API calls
  isHydrated: false,             // App startup complete
  error: null,                   // Error messages
  successMessage: null,          // Success messages
};
```

#### 2. **Async Thunks** (Redux async actions)
```javascript
export const loginAsync = createAsyncThunk(
  'auth/loginAsync',
  async ({ email, password }, { rejectWithValue }) => {
    // Mock API call (replace with real API)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Validation
    if (!email || !password) {
      return rejectWithValue('Email and password are required');
    }
    if (password.length < 6) {
      return rejectWithValue('Invalid credentials');
    }
    
    // Create user and token
    const user = { id: ..., email, displayName: ..., createdAt: ... };
    const token = 'mock-jwt-' + Date.now();
    
    return { user, token };  // Redux state updated automatically
  }
);

export const signUpAsync = createAsyncThunk(
  'auth/signUpAsync',
  async ({ email, password, displayName }, { rejectWithValue }) => {
    // Similar to loginAsync
  }
);
```

**What these do:**
- Handle async login/signup operations
- Manage loading, error, and success states
- Update Redux state on completion

#### 3. **Reducers** (Redux state updaters)
```javascript
reducers: {
  logout: (state) => {
    state.user = null;
    state.token = null;
    state.isAuthenticated = false;
    state.error = null;
  },
  clearError: (state) => {
    state.error = null;
  },
  clearSuccess: (state) => {
    state.successMessage = null;
  },
  setUserFromStorage: (state, action) => {
    state.user = action.payload.user;
    state.token = action.payload.token;
    state.isAuthenticated = !!action.payload.token;
    state.isHydrated = true;
  },
  setHydrated: (state) => {
    state.isHydrated = true;
  },
}
```

**What they do:**
- `logout` - Clears auth state
- `clearError` - Removes error messages
- `clearSuccess` - Removes success messages
- `setUserFromStorage` - Restores user from device storage
- `setHydrated` - Marks app as ready

#### 4. **Extra Reducers** (Handle async thunk results)
```javascript
extraReducers: (builder) => {
  // LOGIN THUNK LIFECYCLE
  builder.addCase(loginAsync.pending, (state) => {
    state.isLoading = true;
    state.error = null;
  });
  builder.addCase(loginAsync.fulfilled, (state, action) => {
    state.isLoading = false;
    state.user = action.payload.user;
    state.token = action.payload.token;
    state.isAuthenticated = true;
    state.successMessage = 'Login successful!';
  });
  builder.addCase(loginAsync.rejected, (state, action) => {
    state.isLoading = false;
    state.error = action.payload || 'Login failed';
  });
  
  // SIGNUP THUNK LIFECYCLE (similar pattern)
  // ... signUpAsync.pending, .fulfilled, .rejected
}
```

**What happens:**
- `pending` - Thunk starts (isLoading = true)
- `fulfilled` - Thunk succeeds (update state with user/token)
- `rejected` - Thunk fails (set error message)

---

## 🟢 CONTEXT API #1 - Authentication

### File: `context/AuthContext.js`

#### 1. **Create Context**
```javascript
const AuthContext = createContext(null);
```

#### 2. **Provider Component**
```javascript
export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();  // Access Redux dispatch
  const auth = useSelector((state) => state.auth);  // Get Redux state

  // Restore user from device storage on app startup
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const stored = await AsyncStorage.getItem('@musica_auth');
        const expiry = await AsyncStorage.getItem('@musica_auth_expiry');
        
        if (stored && expiry && new Date().getTime() < parseInt(expiry)) {
          const { user, token } = JSON.parse(stored);
          dispatch(setUserFromStorage({ user, token }));
        } else {
          dispatch(setHydrated());
        }
      } catch (e) {
        dispatch(setHydrated());
      }
    };
    loadStoredAuth();
  }, [dispatch]);

  // Connect methods with Redux dispatch
  const login = async (email, password) => {
    const result = await dispatch(loginAsync({ email, password }));
    if (result.payload) {
      await persistAuth(result.payload.user, result.payload.token);
    }
    return result;
  };

  const signUp = async (email, password, displayName) => {
    const result = await dispatch(signUpAsync({ email, password, displayName }));
    if (result.payload) {
      await persistAuth(result.payload.user, result.payload.token);
    }
    return result;
  };

  const logout = async () => {
    await removePersistedAuth();
    dispatch(logoutAction());
  };

  // Expose everything via Context
  const value = {
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    isHydrated: auth.isHydrated,
    error: auth.error,
    successMessage: auth.successMessage,
    login,
    signUp,
    logout,
    clearError: () => dispatch(clearError()),
    clearSuccess: () => dispatch(clearSuccess()),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

#### 3. **useAuth Hook** (Easy access)
```javascript
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
```

**What this does:**
- Wraps Redux functionality
- Adds AsyncStorage persistence
- Provides simple hook interface
- No need to use Redux directly!

---

## 🟡 CONTEXT API #2 - Liked Songs

### File: `components/LikedSongsContext.js`

```javascript
import React, { createContext, useState, useContext } from 'react';

const LikedSongsContext = createContext();

export const LikedSongsProvider = ({ children }) => {
  const [likedSongs, setLikedSongs] = useState([]);  // Simple useState, NOT useReducer

  const toggleLike = (song) => {
    setLikedSongs((prevSongs) => {
      const isAlreadyLiked = prevSongs.some((s) => s.id === song.id);
      if (isAlreadyLiked) {
        return prevSongs.filter((s) => s.id !== song.id);  // Remove
      } else {
        return [...prevSongs, song];  // Add
      }
    });
  };

  return (
    <LikedSongsContext.Provider value={{ likedSongs, toggleLike }}>
      {children}
    </LikedSongsContext.Provider>
  );
};

export const useLikedSongs = () => useContext(LikedSongsContext);
```

**What this does:**
- Manages favorite songs globally
- Available in any component via `useLikedSongs()`
- NO Redux, just Context + useState
- Simpler than Redux for this use case

---

### Used in `components/SongItem.js`
```javascript
const SongItem = ({ song, onPress }) => {
  const { likedSongs, toggleLike } = useLikedSongs();  // Access context
  const isLiked = likedSongs.some((savedSong) => savedSong.id === song.id);

  return (
    <TouchableOpacity style={styles.songRow} onPress={onPress}>
      {/* ... */}
      <TouchableOpacity onPress={() => toggleLike(song)}>
        <Ionicons 
          name={isLiked ? "heart" : "heart-outline"} 
          color={isLiked ? "#1DB954" : "#aaaaaa"}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
```

---

## 🔵 useReducer - Complex Form State

### File: `components/LoginScreen.js`

#### 1. **Reducer Function**
```javascript
const formReducer = (state, action) => {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.payload, emailError: '' };
    case 'SET_PASSWORD':
      return { ...state, password: action.payload, passwordError: '' };
    case 'SET_SHOW_PASSWORD':
      return { ...state, showPassword: !state.showPassword };
    case 'SET_ERRORS':
      return {
        ...state,
        emailError: action.payload.emailError ?? state.emailError,
        passwordError: action.payload.passwordError ?? state.passwordError,
      };
    case 'RESET':
      return { email: '', password: '', emailError: '', passwordError: '', showPassword: false };
    default:
      return state;
  }
};
```

**What it does:**
- Manages form input state locally
- Handles validation errors
- Password visibility toggle
- Form reset capability

#### 2. **Using in Component**
```javascript
export default function LoginScreen({ navigation }) {
  const { login, isLoading, error, clearError } = useAuth();  // Context API
  const [form, dispatchForm] = useReducer(formReducer, initialState);  // useReducer

  useEffect(() => {
    if (error) dispatchForm({ type: 'SET_ERRORS', payload: { passwordError: error } });
  }, [error]);

  const handleLogin = async () => {
    if (!validate()) return;
    await login(form.email.trim(), form.password);  // Redux via Context
  };

  return (
    <TextInput
      value={form.email}
      onChangeText={(text) => 
        dispatchForm({ type: 'SET_EMAIL', payload: text })
      }
    />
    // ...
  );
}
```

**What's happening:**
- `useReducer` manages form state (email, password, errors)
- `useAuth()` from Context API calls Redux login
- Redux updates global auth state
- Component re-renders when anything changes

---

### File: `components/SignUpScreen.js`

Same pattern as LoginScreen but with more form fields:

```javascript
const formReducer = (state, action) => {
  switch (action.type) {
    case 'SET_DISPLAY_NAME':
      return { ...state, displayName: action.payload, displayNameError: '' };
    case 'SET_EMAIL':
      return { ...state, email: action.payload, emailError: '' };
    case 'SET_PASSWORD':
      return { ...state, password: action.payload, passwordError: '' };
    case 'SET_CONFIRM_PASSWORD':
      return { ...state, confirmPassword: action.payload, confirmPasswordError: '' };
    case 'SET_SHOW_PASSWORD':
      return { ...state, showPassword: !state.showPassword };
    case 'SET_SHOW_CONFIRM_PASSWORD':
      return { ...state, showConfirmPassword: !state.showConfirmPassword };
    // ... more actions
  }
};
```

---

## 📱 How They Work Together

### App.js Setup
```javascript
import { Provider } from "react-redux";
import { store } from "./store";
import { AuthProvider } from "./context/AuthContext";
import { LikedSongsProvider } from "./components/LikedSongsContext";

export default function App() {
  return (
    <Provider store={store}>                    {/* Redux at top level */}
      <AuthProvider>                            {/* Auth Context API */}
        <LikedSongsProvider>                    {/* Liked Songs Context API */}
          <NavigationContainer>
            <RootNavigator />                   {/* All screens access all 3 */}
          </NavigationContainer>
        </LikedSongsProvider>
      </AuthProvider>
    </Provider>
  );
}
```

---

## 🌊 Data Flow Example: Login

```
User Types Email in TextInput
        ↓
useReducer Reducer: SET_EMAIL action
        ↓
form.email = "user@email.com" (local state)
        ↓
User Clicks "Sign In" Button
        ↓
Validation runs (JavaScript, local)
        ↓
useAuth() hook called: login(email, password)
        ↓
Context API: dispatch loginAsync thunk
        ↓
Redux: loginAsync.pending (isLoading = true)
        ↓
Redux: Mock API awaits 1 second
        ↓
Redux: loginAsync.fulfilled
  - user = {...}
  - token = "mock-jwt-..."
  - isAuthenticated = true
        ↓
Context API: persistAuth() saves to AsyncStorage
        ↓
App Component Re-renders: useAuth() returns new state
        ↓
Navigation: RootNavigator sees isAuthenticated = true
        ↓
NAVIGATION: Switches from AuthStack to MainApp
        ↓
✅ USER LOGGED IN
```

---

## 📊 Comparison Table

| Aspect | useReducer | Context API | Redux |
|--------|-----------|-------------|-------|
| **Purpose** | Local form state | Share state, avoid prop drilling | Global app state |
| **Scope** | Single component | Multiple components | Entire app |
| **Complexity** | Simple forms | Medium complexity | Large apps |
| **Where Used** | LoginScreen, SignUpScreen | AuthContext, LikedSongsContext | authSlice |
| **Data Persists** | No | Optionally (AsyncStorage) | Yes (AsyncStorage) |
| **Performance** | Fast (local) | Medium | Optimized with selectors |
| **Lines of Code** | ~30 lines | ~50 lines | ~150 lines |

---

## 🎯 Quick Reference

### Access Auth State (Context API)
```javascript
const { user, isAuthenticated, logout } = useAuth();
```

### Access Liked Songs (Context API)
```javascript
const { likedSongs, toggleLike } = useLikedSongs();
```

### Use Form State (useReducer)
```javascript
const [form, dispatch] = useReducer(formReducer, initialState);
dispatch({ type: 'SET_EMAIL', payload: 'test@email.com' });
```

### Direct Redux Access (Advanced, usually don't need)
```javascript
const user = useSelector(state => state.auth.user);
const dispatch = useDispatch();
await dispatch(loginAsync({ email, password }));
```

---

## 💾 File Locations

```
Musica/
├── store/
│   ├── index.js                          ← Redux store setup
│   └── slices/
│       └── authSlice.js                  ← Redux reducers + thunks
├── context/
│   └── AuthContext.js                    ← Context API (auth)
├── components/
│   ├── LikedSongsContext.js             ← Context API (liked songs)
│   ├── LoginScreen.js                    ← useReducer (login form)
│   ├── SignUpScreen.js                   ← useReducer (signup form)
│   ├── ProfileScreen.js 
│   ├── HomeScreen.js
│   ├── SongItem.js                       ← Uses LikedSongsContext
│   └── LikedSongs.js                     ← Uses LikedSongsContext
└── App.js                                ← Redux + Context Providers
```

---

## ✅ Summary

Your project successfully uses all three concepts:

1. **Redux** (store/slices/authSlice.js)
   - Global auth state management
   - Async login/signup operations
   - Persistent session handling

2. **Context API** (context/AuthContext.js, components/LikedSongsContext.js)
   - AuthContext wraps Redux for easy access
   - LikedSongsContext manages favorites globally
   - No prop drilling needed

3. **useReducer** (components/LoginScreen.js, components/SignUpScreen.js)
   - Manages complex form state locally
   - Handles validation errors
   - Password visibility toggles

**Best practices followed:**
- Redux for complex async state ✅
- Context API to avoid Redux boilerplate ✅
- useReducer for complex local forms ✅
- Proper separation of concerns ✅
- Persistent authentication ✅
- Clean architecture ✅
