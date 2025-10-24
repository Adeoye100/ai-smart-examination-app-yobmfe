
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { router, Redirect } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function HomeScreen() {
  const { user, isAuthenticated, isDarkMode } = useApp();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  const bgColor = isDarkMode ? colors.backgroundDark : colors.background;
  const cardColor = isDarkMode ? colors.cardDark : colors.card;
  const textColor = isDarkMode ? colors.textDark : colors.text;
  const textSecondaryColor = isDarkMode ? colors.textSecondaryDark : colors.textSecondary;

  const recentExams = user?.exams.slice(-3).reverse() || [];
  const recentResults = user?.results.slice(-3).reverse() || [];

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          Platform.OS !== 'ios' && styles.scrollContentWithTabBar
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: textSecondaryColor }]}>Welcome back,</Text>
            <Text style={[styles.userName, { color: textColor }]}>{user?.name}</Text>
          </View>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: cardColor }]}
            onPress={() => router.push('/upload')}
          >
            <IconSymbol name="plus" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: cardColor }]}>
            <IconSymbol name="doc.fill" size={32} color={colors.primary} />
            <Text style={[styles.statNumber, { color: textColor }]}>
              {user?.courseMaterials.length || 0}
            </Text>
            <Text style={[styles.statLabel, { color: textSecondaryColor }]}>Materials</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: cardColor }]}>
            <IconSymbol name="pencil" size={32} color={colors.accent} />
            <Text style={[styles.statNumber, { color: textColor }]}>
              {user?.exams.length || 0}
            </Text>
            <Text style={[styles.statLabel, { color: textSecondaryColor }]}>Exams</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: cardColor }]}>
            <IconSymbol name="chart.bar.fill" size={32} color={colors.success} />
            <Text style={[styles.statNumber, { color: textColor }]}>
              {user?.results.length > 0
                ? Math.round(
                    user.results.reduce((acc, r) => acc + r.accuracy, 0) / user.results.length
                  )
                : 0}
              %
            </Text>
            <Text style={[styles.statLabel, { color: textSecondaryColor }]}>Avg Score</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Quick Actions</Text>
          </View>
          
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/upload')}
          >
            <IconSymbol name="arrow.up.doc.fill" size={28} color="#ffffff" />
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Upload Material</Text>
              <Text style={styles.actionDescription}>
                Add PDFs, documents, or images
              </Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.accent }]}
            onPress={() => {
              if (user?.courseMaterials.length === 0) {
                alert('Please upload course materials first');
              } else {
                router.push('/exam-config');
              }
            }}
          >
            <IconSymbol name="plus.circle.fill" size={28} color="#ffffff" />
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Create Exam</Text>
              <Text style={styles.actionDescription}>
                Generate AI-powered tests
              </Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {recentExams.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>Recent Exams</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/exams')}>
                <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
              </TouchableOpacity>
            </View>

            {recentExams.map((exam) => (
              <TouchableOpacity
                key={exam.id}
                style={[styles.examCard, { backgroundColor: cardColor }]}
                onPress={() => {
                  if (exam.status === 'pending') {
                    router.push(`/exam?id=${exam.id}`);
                  } else if (exam.status === 'completed') {
                    const result = user?.results.find(r => r.examId === exam.id);
                    if (result) {
                      router.push(`/results?id=${exam.id}`);
                    }
                  }
                }}
              >
                <View style={styles.examHeader}>
                  <Text style={[styles.examTitle, { color: textColor }]}>{exam.title}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          exam.status === 'completed'
                            ? colors.success
                            : exam.status === 'in-progress'
                            ? colors.warning
                            : colors.primary,
                      },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {exam.status === 'completed'
                        ? 'Completed'
                        : exam.status === 'in-progress'
                        ? 'In Progress'
                        : 'Pending'}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.examDetails, { color: textSecondaryColor }]}>
                  {exam.config.numberOfQuestions} questions • {exam.config.duration} min • {exam.config.difficulty}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {recentResults.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>Recent Results</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/results')}>
                <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
              </TouchableOpacity>
            </View>

            {recentResults.map((result) => {
              const exam = user?.exams.find(e => e.id === result.examId);
              return (
                <TouchableOpacity
                  key={result.examId}
                  style={[styles.resultCard, { backgroundColor: cardColor }]}
                  onPress={() => router.push(`/results?id=${result.examId}`)}
                >
                  <View style={styles.resultHeader}>
                    <Text style={[styles.resultTitle, { color: textColor }]}>
                      {exam?.title || 'Exam'}
                    </Text>
                    <Text style={[styles.resultScore, { color: colors.success }]}>
                      {result.accuracy}%
                    </Text>
                  </View>
                  <Text style={[styles.resultDetails, { color: textSecondaryColor }]}>
                    Score: {result.score}/{result.totalPoints} • {new Date(result.completedAt).toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  scrollContentWithTabBar: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  actionContent: {
    flex: 1,
    marginLeft: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  examCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  examHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  examTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  examDetails: {
    fontSize: 14,
  },
  resultCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  resultScore: {
    fontSize: 20,
    fontWeight: '700',
  },
  resultDetails: {
    fontSize: 14,
  },
});
