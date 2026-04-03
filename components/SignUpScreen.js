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
    case 'SET_ERRORS':
      return {
        ...state,
        displayNameError: action.payload.displayNameError ?? state.displayNameError,
        emailError: action.payload.emailError ?? state.emailError,
        passwordError: action.payload.passwordError ?? state.passwordError,
        confirmPasswordError: action.payload.confirmPasswordError ?? state.confirmPasswordError,
      };
    case 'RESET':
      return {
        displayName: '',
        email: '',
        password: '',
        confirmPassword: '',
        displayNameError: '',
        emailError: '',
        passwordError: '',
        confirmPasswordError: '',
        showPassword: false,
        showConfirmPassword: false,
      };
    default:
      return state;
  }
};

const initialState = {
  displayName: '',
  email: '',
  password: '',
  confirmPassword: '',
  displayNameError: '',
  emailError: '',
  passwordError: '',
  confirmPasswordError: '',
  showPassword: false,
  showConfirmPassword: false,
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const getPasswordStrength = (password) => {
  if (!password) return { level: 0, text: '', color: '#999' };
  if (password.length < 6) return { level: 1, text: 'Weak', color: '#e74c3c' };
  if (password.length < 10) return { level: 2, text: 'Fair', color: '#f39c12' };
  return { level: 3, text: 'Strong', color: '#1DB954' };
};

export default function SignUpScreen({ navigation }) {
  const { signUp, isLoading, error, clearError } = useAuth();
  const { theme } = useTheme();
  const [form, dispatchForm] = useReducer(formReducer, initialState);

  useEffect(() => {
    if (error) dispatchForm({ type: 'SET_ERRORS', payload: { passwordError: error } });
  }, [error]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const validate = () => {
    let displayNameError = '';
    let emailError = '';
    let passwordError = '';
    let confirmPasswordError = '';
    let valid = true;

    if (!form.displayName.trim()) {
      displayNameError = 'Display name is required';
      valid = false;
    } else if (form.displayName.trim().length < 2) {
      displayNameError = 'Display name must be at least 2 characters';
      valid = false;
    }

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

    if (!form.confirmPassword) {
      confirmPasswordError = 'Please confirm your password';
      valid = false;
    } else if (form.password !== form.confirmPassword) {
      confirmPasswordError = 'Passwords do not match';
      valid = false;
    }

    if (!valid) {
      dispatchForm({
        type: 'SET_ERRORS',
        payload: { displayNameError, emailError, passwordError, confirmPasswordError },
      });
    }

    return valid;
  };

  const handleSignUp = async () => {
    if (!validate()) return;
    await signUp(form.email.trim(), form.password, form.displayName.trim());
  };

  const passwordStrength = getPasswordStrength(form.password);

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
          <Text style={[styles.tagline, { color: theme.textSecondary }]}>Sign up to get started</Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.title, { color: theme.text }]}>Create account</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Join Musica and start your music journey</Text>

          <View style={[styles.inputContainer, { backgroundColor: theme.input }]}>
            <Ionicons name="person-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.text }, form.displayNameError && styles.inputError]}
              placeholder="Display name"
              placeholderTextColor={theme.textSecondary}
              value={form.displayName}
              onChangeText={(text) => dispatchForm({ type: 'SET_DISPLAY_NAME', payload: text })}
              autoCapitalize="words"
              editable={!isLoading}
            />
          </View>
          {form.displayNameError && <Text style={[styles.errorText, { color: theme.error }]}>{form.displayNameError}</Text>}

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
              autoComplete="password-new"
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

          {form.password && (
            <View style={[styles.strengthContainer, { backgroundColor: theme.border }]}>
              <View style={[styles.strengthBar, { width: `${(passwordStrength.level / 3) * 100}%`, backgroundColor: passwordStrength.color }]} />
            </View>
          )}
          {form.password && <Text style={[styles.strengthText, { color: passwordStrength.color }]}>Password strength: {passwordStrength.text}</Text>}

          <View style={[styles.inputContainer, { backgroundColor: theme.input }]}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.text }, form.confirmPasswordError && styles.inputError]}
              placeholder="Confirm password"
              placeholderTextColor={theme.textSecondary}
              value={form.confirmPassword}
              onChangeText={(text) => dispatchForm({ type: 'SET_CONFIRM_PASSWORD', payload: text })}
              secureTextEntry={!form.showConfirmPassword}
              editable={!isLoading}
              autoComplete="password-new"
            />
            <TouchableOpacity
              onPress={() => dispatchForm({ type: 'SET_SHOW_CONFIRM_PASSWORD' })}
              disabled={!form.confirmPassword}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={form.showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={form.confirmPassword ? theme.accent : theme.textSecondary}
              />
            </TouchableOpacity>
          </View>
          {form.confirmPassword && form.password === form.confirmPassword && (
            <View style={styles.matchContainer}>
              <Ionicons name="checkmark-circle" size={16} color={theme.accent} />
              <Text style={[styles.matchText, { color: theme.accent }]}>Passwords match</Text>
            </View>
          )}
          {form.confirmPasswordError && <Text style={[styles.errorText, { color: theme.error }]}>{form.confirmPasswordError}</Text>}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.accent }, isLoading && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <Text style={[styles.dividerText, { color: theme.textSecondary }]}>or</Text>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
          </View>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.replace('Login')}
            disabled={isLoading}
          >
            <Text style={[styles.loginLinkText, { color: theme.textSecondary }]}>Already have an account? </Text>
            <Text style={[styles.loginLinkBold, { color: theme.accent }]}>Sign in</Text>
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
  tagline: {
    fontSize: 14,
    marginTop: 4,
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
    marginBottom: 24,
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
  strengthContainer: {
    height: 4,
    borderRadius: 2,
    marginBottom: 6,
    overflow: 'hidden',
  },
  strengthBar: {
    height: '100%',
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 16,
  },
  matchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  matchText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#1DB954',
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
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 14,
  },
  loginLinkBold: {
    fontSize: 14,
    fontWeight: '600',
  },
});
