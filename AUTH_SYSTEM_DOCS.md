# Musica Authentication System Documentation

## Overview
This is a complete authentication system combining Redux, Context API, and React Native form state management.

## Architecture

### 1. Redux State Management (`store/slices/authSlice.js`)
Handles global auth state with async thunks for API calls.

**State Structure:**
```javascript
{
  auth: {
    user: { id, email, displayName, createdAt },
    token: 'mock-jwt-...',
    isAuthenticated: boolean,
    isLoading: boolean,
    isHydrated: boolean,
    error: null | string,
    successMessage: null | string
  }
}
```

**Async Thunks:**
- `loginAsync({ email, password })` - Authenticates user
- `signUpAsync({ email, password, displayName })` - Creates new account

**Reducers:**
- `logout()` - Clears auth state
- `clearError()` - Resets error message
- `clearSuccess()` - Resets success message
- `setUserFromStorage()` - Hydrates state from AsyncStorage
- `setHydrated()` - Marks app as ready

### 2. Context API (`context/AuthContext.js`)
Bridges Redux and components, provides high-level auth methods.

**Features:**
- Persistent auth storage with 7-day expiry
- Auto-restore auth on app startup
- Loading states and error handling
- Success messages after auth actions

**useAuth() Hook provides:**
```javascript
{
  // State
  user: object,
  token: string,
  isAuthenticated: boolean,
  isLoading: boolean,
  isHydrated: boolean,
  error: string | null,
  successMessage: string | null,
  
  // Methods
  login(email, password),
  signUp(email, password, displayName),
  logout(),
  clearError(),
  clearSuccess()
}
```

### 3. Component Form State (`components/LoginScreen.js`, `components/SignUpScreen.js`)
Uses React's `useReducer` for local form validation and UI state.

**Form Reducer Actions:**
- `SET_EMAIL` / `SET_PASSWORD` / `SET_DISPLAY_NAME` - Update form fields
- `SET_ERRORS` - Set validation errors
- `SET_SHOW_PASSWORD` - Toggle password visibility
- `RESET` - Clear all form data

**Validation:**
- Email format validation (regex)
- Password length requirements (min 6 chars)
- Password confirmation matching (signup only)
- Password strength indicator (signup only)

## Data Flow

```
User Input (Component)
    ↓
Form Reducer (Local State)
    ↓
Validation (LoginScreen/SignUpScreen)
    ↓
useAuth() Hook (dispatch to Redux)
    ↓
Async Thunk (loginAsync/signUpAsync)
    ↓
Redux State Update (authSlice)
    ↓
AsyncStorage Persistence
    ↓
Navigation Change (App.js RootNavigator)
```

## Component Features

### LoginScreen
- Email and password inputs with icons
- Email format validation
- Password visibility toggle
- Loading state during auth
- Error display
- Link to signup page
- Spotify-like dark theme (Musica branding)

### SignUpScreen
- Additional display name field
- Password strength indicator
- Password confirmation field
- Visual match indicator for password confirmation
- All LoginScreen features
- Enhanced validation (name, email, password match)

## Usage Example

```javascript
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { login, signUp, logout, user, isLoading, error } = useAuth();
  
  // Login
  await login('user@email.com', 'password123');
  
  // Sign Up
  await signUp('user@email.com', 'password123', 'John Doe');
  
  // Logout
  await logout();
  
  // Check auth
  if (user) {
    console.log(user.displayName);
  }
}
```

## Conditional Navigation (App.js)

```javascript
function RootNavigator() {
  const { isAuthenticated, isHydrated } = useAuth();
  
  if (!isHydrated) return null; // Loading splash
  
  return (
    <NavigationContainer>
      {isAuthenticated ? <MainApp /> : <AuthStack />}
    </NavigationContainer>
  );
}
```

## Security Features

1. **Token Storage:** Encrypted by AsyncStorage
2. **Session Expiry:** 7-day auto-expiry with timestamp
3. **Secure Password:** Never stored in plain text (mock backend)
4. **Validation:** Client-side validation before API calls
5. **Error Handling:** Generic auth failure messages
6. **State Hydration:** Automatic restore on app start with expiry check

## To Replace Mock API

In `store/slices/authSlice.js`, replace the thunks:

```javascript
export const loginAsync = createAsyncThunk(
  'auth/loginAsync',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch('YOUR_API_URL/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return { user: data.user, token: data.token };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

## Testing Credentials (Mock)

- Email: any@valid.email (must match regex)
- Password: minimum 6 characters
- No actual authentication happens; all requests succeed after 1-second delay

## File Structure

```
Musica/
├── store/
│   ├── index.js (Redux store configuration)
│   └── slices/
│       └── authSlice.js (Auth reducer + async thunks)
├── context/
│   └── AuthContext.js (Context provider + hook)
├── components/
│   ├── LoginScreen.js (Login UI)
│   ├── SignUpScreen.js (Signup UI)
│   └── ... (other components)
└── App.js (Navigation with auth guard)
```

## Key Improvements

✅ **Redux Toolkit** - Simplified Redux with async thunks
✅ **Context API** - Clean hook-based interface
✅ **Form Reduction** - Local state for form validation
✅ **Async Storage** - Persistent authentication
✅ **Input Validation** - Email regex, password strength
✅ **Error Handling** - Centralized error management
✅ **Loading States** - Disabled inputs during requests
✅ **Password Strength** - Visual indicator on signup
✅ **Password Confirmation** - Matching validation
✅ **Session Expiry** - 7-day auto-logout
✅ **Dark Theme** - Spotify-like Musica branding
