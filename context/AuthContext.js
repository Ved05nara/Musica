import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  loginAsync,
  signUpAsync,
  logout as logoutAction,
  setUserFromStorage,
  setHydrated,
  clearError,
  clearSuccess,
} from '../store/slices/authSlice';

const AUTH_STORAGE_KEY = '@musica_auth';
const AUTH_EXPIRY_KEY = '@musica_auth_expiry';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  // Restore auth from storage on app load
  useEffect(() => {
    let isMounted = true;
    
    const loadStoredAuth = async () => {
      try {
        console.log('AuthContext: Starting auth load...');
        const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        const expiry = await AsyncStorage.getItem(AUTH_EXPIRY_KEY);
        console.log('AuthContext: Auth data retrieved:', { hasStored: !!stored, hasExpiry: !!expiry });
        
        if (isMounted) {
          if (stored && expiry && new Date().getTime() < parseInt(expiry)) {
            const { user, token } = JSON.parse(stored);
            console.log('AuthContext: Restoring user from storage');
            dispatch(setUserFromStorage({ user, token }));
          } else {
            // Clear expired auth
            console.log('AuthContext: No valid stored auth, clearing and hydrating');
            await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
            await AsyncStorage.removeItem(AUTH_EXPIRY_KEY);
            dispatch(setHydrated());
          }
        }
      } catch (e) {
        console.warn('Failed to restore auth', e);
        if (isMounted) {
          console.log('AuthContext: Forcing hydration due to error');
          dispatch(setHydrated());
        }
      }
    };
    
    loadStoredAuth();
    
    // Safety timeout - ensure hydration completes within 3 seconds
    const timeout = setTimeout(() => {
      if (isMounted && !auth.isHydrated) {
        console.warn('Auth hydration timeout, forcing hydration');
        dispatch(setHydrated());
      }
    }, 3000);
    
    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [dispatch]);

  const persistAuth = async (user, token) => {
    try {
      // Store auth data with 7-day expiry
      const expiryTime = new Date().getTime() + (7 * 24 * 60 * 60 * 1000);
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, token }));
      await AsyncStorage.setItem(AUTH_EXPIRY_KEY, expiryTime.toString());
    } catch (e) {
      console.warn('Failed to persist auth', e);
    }
  };

  const removePersistedAuth = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      await AsyncStorage.removeItem(AUTH_EXPIRY_KEY);
    } catch (e) {
      console.warn('Failed to remove persisted auth', e);
    }
  };

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

  const value = {
    // State
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    isHydrated: auth.isHydrated,
    error: auth.error,
    successMessage: auth.successMessage,
    // Methods
    login,
    signUp,
    logout,
    clearError: () => dispatch(clearError()),
    clearSuccess: () => dispatch(clearSuccess()),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
