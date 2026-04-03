import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isHydrated: false,
  error: null,
  successMessage: null,
};

// Async thunks for API calls
export const loginAsync = createAsyncThunk(
  'auth/loginAsync',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Mock API call - replace with real API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock validation
      if (!email || !password) {
        return rejectWithValue('Email and password are required');
      }
      if (password.length < 6) {
        return rejectWithValue('Invalid credentials');
      }
      
      const user = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        displayName: email.split('@')[0],
        createdAt: new Date().toISOString(),
      };
      const token = 'mock-jwt-' + Date.now();
      
      return { user, token };
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const signUpAsync = createAsyncThunk(
  'auth/signUpAsync',
  async ({ email, password, displayName }, { rejectWithValue }) => {
    try {
      // Mock API call - replace with real API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock validation
      if (!email || !password || !displayName) {
        return rejectWithValue('All fields are required');
      }
      if (password.length < 6) {
        return rejectWithValue('Password must be at least 6 characters');
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return rejectWithValue('Invalid email format');
      }
      
      const user = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        displayName,
        createdAt: new Date().toISOString(),
      };
      const token = 'mock-jwt-' + Date.now();
      
      return { user, token };
    } catch (error) {
      return rejectWithValue(error.message || 'Sign up failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.successMessage = null;
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
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginAsync.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      state.successMessage = 'Login successful!';
    });
    builder.addCase(loginAsync.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Login failed';
    });
    
    // Sign Up
    builder.addCase(signUpAsync.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(signUpAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      state.successMessage = 'Account created successfully!';
    });
    builder.addCase(signUpAsync.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Sign up failed';
    });
  },
});

export const {
  logout,
  clearError,
  clearSuccess,
  setUserFromStorage,
  setHydrated,
} = authSlice.actions;

export default authSlice.reducer;
