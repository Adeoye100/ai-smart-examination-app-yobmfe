
import React from 'react';
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

export default function ResultsScreen() {
  const { user, isAuthenticated, isDarkMode } = useApp();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  const bgColor = isDarkMode ? colors.backgroundDark : colors.background;
  const cardColor = isDarkMode ? colors.cardDark : colors.card;
  const textColor = isDarkMode ? colors.textDark : colors.text;
  const textSecondaryColor = isDarkMode ? colors.textSecondaryDark : colors.textSecondary;

  const results = user?.results || [];

  const getScoreColor = (accuracy: number) => {
    if (accuracy >= 80) return colors.success;
    if (accuracy >= 60) return colors.warning;
    return colors.error;
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Exam Results</Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          Platform.OS !== 'ios' && styles.scrollContentWithTabBar
        ]}
        showsVerticalScrollIndicator={false}
      >
        {results.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol name="chart.bar.fill" size={80} color={textSecondaryColor} />
            <Text style={[styles.emptyTitle, { color: textColor }]}>No Results Yet</Text>
            <Text style={[styles.emptyDescription, { color: textSecondaryColor }]}>
              Complete an exam to see your results
            </Text>
          </View>
        ) : (
          <>
            {results.length > 0 && (
              <View style={[styles.summaryCard, { backgroundColor: cardColor }]}>
                <Text style={[styles.summaryTitle, { color: textColor }]}>Overall Performance</Text>
                <View style={styles.summaryStats}>
                  <View style={styles.summaryItem}>
                    <Text style={[styles.summaryValue, { color: colors.primary }]}>
                      {results.length}
                    </Text>
                    <Text style={[styles.summaryLabel, { color: textSecondaryColor }]}>
                      Exams Taken
                    </Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={[styles.summaryValue, { color: colors.success }]}>
                      {Math.round(
                        results.reduce((acc, r) => acc + r.accuracy, 0) / results.length
                      )}%
                    </Text>
                    <Text style={[styles.summaryLabel, { color: textSecondaryColor }]}>
                      Avg Score
                    </Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={[styles.summaryValue, { color: colors.accent }]}>
                      {results.filter(r => r.accuracy >= 80).length}
                    </Text>
                    <Text style={[styles.summaryLabel, { color: textSecondaryColor }]}>
                      Excellent
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {results.map((result) => {
              const exam = user?.exams.find(e => e.id === result.examId);
              return (
                <TouchableOpacity
                  key={result.examId}
                  style={[styles.resultCard, { backgroundColor: cardColor }]}
                  onPress={() => router.push(`/results?id=${result.examId}`)}
                >
                  <View style={styles.resultHeader}>
                    <View style={styles.resultTitleContainer}>
                      <Text style={[styles.resultTitle, { color: textColor }]}>
                        {exam?.title || 'Exam'}
                      </Text>
                      <View
                        style={[
                          styles.scoreBadge,
                          { backgroundColor: getScoreColor(result.accuracy) },
                        ]}
                      >
                        <Text style={styles.scoreText}>{result.accuracy}%</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.resultDetails}>
                    <View style={styles.detailRow}>
                      <Text style={[styles.detailLabel, { color: textSecondaryColor }]}>
                        Score:
                      </Text>
                      <Text style={[styles.detailValue, { color: textColor }]}>
                        {result.score}/{result.totalPoints}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={[styles.detailLabel, { color: textSecondaryColor }]}>
                        Date:
                      </Text>
                      <Text style={[styles.detailValue, { color: textColor }]}>
                        {new Date(result.completedAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>

                  {result.weakAreas && result.weakAreas.length > 0 && (
                    <View style={styles.weakAreasContainer}>
                      <Text style={[styles.weakAreasTitle, { color: textSecondaryColor }]}>
                        Areas to improve:
                      </Text>
                      <View style={styles.weakAreasList}>
                        {result.weakAreas.slice(0, 2).map((area, index) => (
                          <View
                            key={index}
                            style={[styles.weakAreaBadge, { backgroundColor: colors.highlight }]}
                          >
                            <Text style={[styles.weakAreaText, { color: colors.primary }]}>
                              {area}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </>
        )}
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: 'center',
  },
  summaryCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  summaryLabel: {
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
    marginBottom: 12,
  },
  resultTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  scoreBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  resultDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  weakAreasContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  weakAreasTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  weakAreasList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  weakAreaBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 4,
  },
  weakAreaText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
