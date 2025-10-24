
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Switch,
} from 'react-native';
import { router, Redirect } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function ProfileScreen() {
  const { user, isAuthenticated, isDarkMode, toggleTheme, logout } = useApp();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  const bgColor = isDarkMode ? colors.backgroundDark : colors.background;
  const cardColor = isDarkMode ? colors.cardDark : colors.card;
  const textColor = isDarkMode ? colors.textDark : colors.text;
  const textSecondaryColor = isDarkMode ? colors.textSecondaryDark : colors.textSecondary;

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Profile</Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          Platform.OS !== 'ios' && styles.scrollContentWithTabBar
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.profileCard, { backgroundColor: cardColor }]}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>
              {user?.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.userName, { color: textColor }]}>{user?.name}</Text>
          <Text style={[styles.userEmail, { color: textSecondaryColor }]}>{user?.email}</Text>
        </View>

        <View style={[styles.section, { backgroundColor: cardColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Statistics</Text>
          
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <IconSymbol name="doc.fill" size={24} color={colors.primary} />
              <Text style={[styles.statValue, { color: textColor }]}>
                {user?.courseMaterials.length || 0}
              </Text>
              <Text style={[styles.statLabel, { color: textSecondaryColor }]}>
                Materials
              </Text>
            </View>

            <View style={styles.statItem}>
              <IconSymbol name="pencil" size={24} color={colors.accent} />
              <Text style={[styles.statValue, { color: textColor }]}>
                {user?.exams.length || 0}
              </Text>
              <Text style={[styles.statLabel, { color: textSecondaryColor }]}>
                Exams
              </Text>
            </View>

            <View style={styles.statItem}>
              <IconSymbol name="chart.bar.fill" size={24} color={colors.success} />
              <Text style={[styles.statValue, { color: textColor }]}>
                {user?.results.length > 0
                  ? Math.round(
                      user.results.reduce((acc, r) => acc + r.accuracy, 0) / user.results.length
                    )
                  : 0}
                %
              </Text>
              <Text style={[styles.statLabel, { color: textSecondaryColor }]}>
                Avg Score
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: cardColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Settings</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <IconSymbol name="moon.fill" size={20} color={textColor} />
              <Text style={[styles.settingText, { color: textColor }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.disabled, true: colors.primary }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.secondary }]}
          onPress={handleLogout}
        >
          <IconSymbol name="arrow.right.square" size={20} color="#ffffff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
  },
  scrollContentWithTabBar: {
    paddingBottom: 100,
  },
  profileCard: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
  },
  section: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
});
