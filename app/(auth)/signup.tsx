
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function SignupScreen() {
  const { signup, isDarkMode } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const success = await signup(name, email, password);
    setLoading(false);

    if (success) {
      router.replace('/(tabs)/(home)/');
    } else {
      Alert.alert('Error', 'Email already exists');
    }
  };

  const bgColor = isDarkMode ? colors.backgroundDark : colors.background;
  const cardColor = isDarkMode ? colors.cardDark : colors.card;
  const textColor = isDarkMode ? colors.textDark : colors.text;
  const inputStyle = isDarkMode ? commonStyles.inputDark : commonStyles.input;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: bgColor }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <IconSymbol name="graduationcap.fill" size={80} color={colors.primary} />
          <Text style={[styles.title, { color: textColor }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: isDarkMode ? colors.textSecondaryDark : colors.textSecondary }]}>
            Start your learning journey
          </Text>
        </View>

        <View style={[styles.formCard, { backgroundColor: cardColor }]}>
          <TextInput
            style={[inputStyle, { color: textColor }]}
            placeholder="Full Name"
            placeholderTextColor={isDarkMode ? colors.textSecondaryDark : colors.textSecondary}
            value={name}
            onChangeText={setName}
            autoComplete="name"
          />

          <TextInput
            style={[inputStyle, { color: textColor }]}
            placeholder="Email"
            placeholderTextColor={isDarkMode ? colors.textSecondaryDark : colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <TextInput
            style={[inputStyle, { color: textColor }]}
            placeholder="Password"
            placeholderTextColor={isDarkMode ? colors.textSecondaryDark : colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
          />

          <TextInput
            style={[inputStyle, { color: textColor }]}
            placeholder="Confirm Password"
            placeholderTextColor={isDarkMode ? colors.textSecondaryDark : colors.textSecondary}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoComplete="password"
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleSignup}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: isDarkMode ? colors.textSecondaryDark : colors.textSecondary }]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={[styles.loginLink, { color: colors.primary }]}>Login</Text>
            </TouchableOpacity>
          </View>
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
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  formCard: {
    borderRadius: 16,
    padding: 24,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
