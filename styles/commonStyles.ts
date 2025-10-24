
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

// App Color Scheme
export const colors = {
  background: '#f9f9f9',
  backgroundDark: '#121212',
  text: '#212121',
  textDark: '#e3e3e3',
  textSecondary: '#757575',
  textSecondaryDark: '#b0b0b0',
  primary: '#3f51b5',
  primaryDark: '#5c6bc0',
  secondary: '#f44336',
  secondaryDark: '#ef5350',
  accent: '#ff4081',
  accentDark: '#ff5a92',
  card: '#ffffff',
  cardDark: '#1e1e1e',
  highlight: '#bbdefb',
  highlightDark: '#1976d2',
  border: '#e0e0e0',
  borderDark: '#333333',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  disabled: '#bdbdbd',
};

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary: {
    backgroundColor: colors.secondary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  outlineText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  containerDark: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  cardDark: {
    backgroundColor: colors.cardDark,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.3)',
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  titleDark: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  subtitleDark: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  textDark: {
    fontSize: 16,
    color: colors.textDark,
    lineHeight: 24,
  },
  textSecondary: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  textSecondaryDark: {
    fontSize: 14,
    color: colors.textSecondaryDark,
    lineHeight: 20,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
  },
  inputDark: {
    backgroundColor: colors.cardDark,
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
