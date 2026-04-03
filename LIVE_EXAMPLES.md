# Live Example 1: Using useAuth() Hook in Components

## The Simplest Way to Access Auth State

### In ANY Component - Just Import and Use

```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  // That's it! You have everything
  const { user, login, logout, isLoading, error } = useAuth();
  
  return (
    <View>
      <Text>Hello {user.displayName}</Text>
    </View>
  );
}
```

### Complete HomeScreen Example
```javascript
import { useAuth } from '../context/AuthContext';
import { View, Text, TouchableOpacity } from 'react-native';

export default function HomeScreen() {\n  const { user, logout, isLoading } = useAuth();

  return (
    <View>
      <Text>This content is only visible to logged-in users</Text>
      <Text>Welcome, {user.displayName}!</Text>
      
      <TouchableOpacity 
        onPress={() => logout()} 
        disabled={isLoading}
      >
        <Text>{isLoading ? 'Logging out...' : 'Logout'}</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

# Live Example 2: useReducer for Complex Form State

## Used in LoginScreen/SignUpScreen for Managing Form Inputs

### The Reducer
```javascript
const formReducer = (state, action) => {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.payload, emailError: '' };
    case 'SET_PASSWORD':
      return { ...state, password: action.payload, passwordError: '' };
    case 'SET_ERRORS':
      return { 
        ...state, 
        emailError: action.payload.emailError ?? state.emailError,
      };
    case 'RESET':
      return { email: '', password: '', emailError: '', passwordError: '' };
    default:
      return state;
  }
};

const initialState = {
  email: '',
  password: '',
  emailError: '',\n  passwordError: '',\n};
```

### Using the Reducer in a Component
```javascript\nimport { useReducer } from 'react';
import { TextInput, TouchableOpacity, Text } from 'react-native';

export default function LoginForm() {
  const [form, dispatch] = useReducer(formReducer, initialState);

  return (
    <>
      {/* Email Input */}
      <TextInput
        value={form.email}
        onChangeText={(text) => 
          dispatch({ type: 'SET_EMAIL', payload: text })
        }
      />\n      {form.emailError && <Text>{form.emailError}</Text>}

      {/* Password Input */}
      <TextInput
        value={form.password}
        onChangeText={(text) => 
          dispatch({ type: 'SET_PASSWORD', payload: text })
        }
      />\n      {form.passwordError && <Text>{form.passwordError}</Text>}

      {/* Clear Button */}
      <TouchableOpacity onPress={() => dispatch({ type: 'RESET' })}>
        <Text>Clear Form</Text>
      </TouchableOpacity>
    </>
  );
}
```

---

# Live Example 3: ProfileScreen - All Concepts Together

See [ProfileScreen.js](components/ProfileScreen.js) for a complete working example combining:
- ✅ useAuth() hook (Context API)
- ✅ useReducer for form state
- ✅ Redux state access
- ✅ Edit profile with form validation
- ✅ Logout functionality

---

# Live Example 4: Direct Redux Access (Advanced - Optional)

## Only use if useAuth() doesn't have what you need

### Access Redux State with useSelector
```javascript
import { useSelector } from 'react-redux';

function AdvancedComponent() {
  // Get specific Redux state
  const user = useSelector(state => state.auth.user);
  const isLoading = useSelector(state => state.auth.isLoading);
  const error = useSelector(state => state.auth.error);
  
  // Or get multiple at once
  const auth = useSelector(state => ({
    user: state.auth.user,
    isLoading: state.auth.isLoading,
    isAuthenticated: state.auth.isAuthenticated,
  }));

  return <Text>{user?.displayName}</Text>;
}
```

### Dispatch Redux Actions with useDispatch
```javascript
import { useDispatch } from 'react-redux';
import { loginAsync, logout } from '../store/slices/authSlice';

function AdvancedComponent() {
  const dispatch = useDispatch();

  const handleLogin = async () => {\n    const result = await dispatch(loginAsync({
      email: 'user@email.com',
      password: 'password123'
    }));
    
    if (result.meta.requestStatus === 'fulfilled') {\n      console.log('Login success');\n    }\n  };

  const handleLogout = () => {\n    dispatch(logout());\n  };

  return (\n    <>\n      <Button onPress={handleLogin} title=\"Login\" />\n      <Button onPress={handleLogout} title=\"Logout\" />\n    </>\n  );\n}
```

⚠️ **WARNING:** This is more complex. Stick with `useAuth()` instead!

---

# Which One Should I Use?

## 95% of the Time: useAuth() Hook ✅

```javascript
const { user, login, logout, isLoading } = useAuth();
```

**When to use:**
- Display user info
- Logout users
- Check if user is authenticated
- Show loading states
- Display error messages

---

## Form State: useReducer ✅

```javascript
const [form, dispatch] = useReducer(formReducer, initialState);
dispatch({ type: 'SET_EMAIL', payload: text });
```

**When to use:**
- Complex form with multiple inputs
- Form validation
- Form reset functionality
- Local component state

---

## Redux Direct Access: useSelector/useDispatch ⚠️

```javascript
const user = useSelector(state => state.auth.user);
const dispatch = useDispatch();
```

**When to use:**
- Very advanced cases
- Custom Redux operations
- Not usually needed!

---

# The Complete Data Flow (Visual)

```
User Types in Login Form
    ↓
LOCAL: useReducer updates form state
    ↓
form.email = \"user@email.com\"
form.password = \"password123\"
    ↓
User Clicks \"Sign In\" Button
    ↓
VALIDATION: JavaScript checks email format, password length
    ↓
Context: await login(email, password) called
    ↓
Redux: loginAsync thunk dispatched
    ↓
NETWORK: Mock API awaits 1 second
    ↓
Redux: auth state updated
    • isLoading = true → false
    • user = { id, email, displayName }
    • token = \"mock-jwt-...\"
    • isAuthenticated = true
    ↓
AsyncStorage: Data persisted to device
    ↓\nComponent Re-renders: useAuth() returns new state
    ↓
App.js RootNavigator: Sees isAuthenticated = true
    ↓\nNAVIGATION: Switches from AuthStack to MainApp
    ↓\nUSER LOGGED IN ✅\n```

---

# Quick Copy-Paste Guide

## Access User Info
```javascript\nconst { user } = useAuth();
console.log(user.displayName); // \"John Doe\"
console.log(user.email);       // \"john@example.com\"
```

## Check if Logged In
```javascript
const { isAuthenticated } = useAuth();
if (isAuthenticated) {\n  // Show main app\n} else {\n  // Show login\n}\n```

## Show Loading State\n```javascript
const { isLoading } = useAuth();
<TouchableOpacity disabled={isLoading}>\n  <Text>{isLoading ? 'Loading...' : 'Login'}</Text>\n</TouchableOpacity>\n```

## Show Errors
```javascript\nconst { error } = useAuth();
{error && <Text>{error}</Text>}\n```

## Form Input with Reducer
```javascript\nconst [form, dispatch] = useReducer(formReducer, initialState);n<TextInput\n  value={form.email}
  onChangeText={(text) => dispatch({ type: 'SET_EMAIL', payload: text })}\n/>\n```

## Logout
```javascript\nconst { logout } = useAuth();\n<Button onPress={() => logout()} title=\"Logout\" />\n```

---

You're all set! Check [ProfileScreen.js](components/ProfileScreen.js) for the complete working example.
"