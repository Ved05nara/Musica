import React, { useReducer, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

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

const initialState = {
  email: '',
  password: '',
  emailError: '',
  passwordError: '',
  showPassword: false,
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function LoginScreen({ navigation }) {
  const { login, isLoading, error, clearError } = useAuth();
  const { theme } = useTheme();
  const [form, dispatchForm] = useReducer(formReducer, initialState);

  useEffect(() => {
    if (error) dispatchForm({ type: 'SET_ERRORS', payload: { passwordError: error } });
  }, [error]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const validate = () => {
    let emailError = '';
    let passwordError = '';
    let valid = true;

    if (!form.email.trim()) {
      emailError = 'Email is required';
      valid = false;
    } else if (!validateEmail(form.email.trim())) {
      emailError = 'Please enter a valid email';
      valid = false;
    }

    if (!form.password) {
      passwordError = 'Password is required';
      valid = false;
    } else if (form.password.length < 6) {
      passwordError = 'Password must be at least 6 characters';
      valid = false;
    }

    if (!valid) {
      dispatchForm({
        type: 'SET_ERRORS',
        payload: { emailError, passwordError },
      });
    }

    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    await login(form.email.trim(), form.password);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Ionicons name="musical-notes" size={48} color={theme.accent} />
          <Text style={[styles.appName, { color: theme.text }]}>Musica</Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.title, { color: theme.text }]}>Welcome back</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Sign in to continue to Musica</Text>

          <View style={[styles.inputContainer, { backgroundColor: theme.input }]}>
            <Ionicons name="mail-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.text }, form.emailError && styles.inputError]}
              placeholder="Email address"
              placeholderTextColor={theme.textSecondary}
              value={form.email}
              onChangeText={(text) => dispatchForm({ type: 'SET_EMAIL', payload: text })}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
              autoComplete="email"
            />
          </View>
          {form.emailError && <Text style={[styles.errorText, { color: theme.error }]}>{form.emailError}</Text>}

          <View style={[styles.inputContainer, { backgroundColor: theme.input }]}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.text }, form.passwordError && styles.inputError]}
              placeholder="Password"
              placeholderTextColor={theme.textSecondary}
              value={form.password}
              onChangeText={(text) => dispatchForm({ type: 'SET_PASSWORD', payload: text })}
              secureTextEntry={!form.showPassword}
              editable={!isLoading}
              autoComplete="password"
            />
            <TouchableOpacity
              onPress={() => dispatchForm({ type: 'SET_SHOW_PASSWORD' })}
              disabled={!form.password}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={form.showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={form.password ? theme.accent : theme.textSecondary}
              />
            </TouchableOpacity>
          </View>
          {form.passwordError && <Text style={[styles.errorText, { color: theme.error }]}>{form.passwordError}</Text>}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.accent }, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <Text style={[styles.dividerText, { color: theme.textSecondary }]}>or</Text>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
          </View>

          <TouchableOpacity
            style={styles.signupLink}
            onPress={() => navigation.replace('SignUp')}
            disabled={isLoading}
          >
            <Text style={[styles.signupLinkText, { color: theme.textSecondary }]}>Don't have an account? </Text>
            <Text style={[styles.signupLinkBold, { color: theme.accent }]}>Create one</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 12,
  },
  card: {
    borderRadius: 16,
    padding: 28,
    borderWidth: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 28,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
  },
  inputError: {
    borderWidth: 1.5,
    borderColor: '#e74c3c',
  },
  eyeIcon: {
    padding: 8,
  },
  errorText: {
    fontSize: 12,
    marginBottom: 16,
    fontWeight: '500',
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
  },
  signupLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupLinkText: {
    fontSize: 14,
  },
  signupLinkBold: {
    fontSize: 14,
    fontWeight: '600',
  },
});
