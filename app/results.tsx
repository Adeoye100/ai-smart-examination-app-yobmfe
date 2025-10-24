
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function ResultsDetailScreen() {
  const { id } = useLocalSearchParams();
  const { user, getExamById, isDarkMode } = useApp();
  
  const exam = getExamById(id as string);
  const result = user?.results.find(r => r.examId === id);

  const bgColor = isDarkMode ? colors.backgroundDark : colors.background;
  const cardColor = isDarkMode ? colors.cardDark : colors.card;
  const textColor = isDarkMode ? colors.textDark : colors.text;
  const textSecondaryColor = isDarkMode ? colors.textSecondaryDark : colors.textSecondary;

  if (!exam || !result) {
    return (
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: textColor }]}>Results not found</Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const getScoreColor = (accuracy: number) => {
    if (accuracy >= 80) return colors.success;
    if (accuracy >= 60) return colors.warning;
    return colors.error;
  };

  const getPerformanceMessage = (accuracy: number) => {
    if (accuracy >= 90) return 'Outstanding!';
    if (accuracy >= 80) return 'Excellent!';
    if (accuracy >= 70) return 'Good Job!';
    if (accuracy >= 60) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.scoreCard, { backgroundColor: cardColor }]}>
          <View style={[styles.scoreCircle, { borderColor: getScoreColor(result.accuracy) }]}>
            <Text style={[styles.scorePercentage, { color: getScoreColor(result.accuracy) }]}>
              {result.accuracy}%
            </Text>
            <Text style={[styles.scoreLabel, { color: textSecondaryColor }]}>
              {getPerformanceMessage(result.accuracy)}
            </Text>
          </View>
          
          <View style={styles.scoreDetails}>
            <View style={styles.scoreRow}>
              <Text style={[styles.scoreDetailLabel, { color: textSecondaryColor }]}>
                Score:
              </Text>
              <Text style={[styles.scoreDetailValue, { color: textColor }]}>
                {result.score} / {result.totalPoints}
              </Text>
            </View>
            <View style={styles.scoreRow}>
              <Text style={[styles.scoreDetailLabel, { color: textSecondaryColor }]}>
                Completed:
              </Text>
              <Text style={[styles.scoreDetailValue, { color: textColor }]}>
                {new Date(result.completedAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: cardColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>AI Feedback</Text>
          <Text style={[styles.feedbackText, { color: textColor }]}>
            {result.feedback}
          </Text>
        </View>

        {result.topicPerformance.length > 0 && (
          <View style={[styles.section, { backgroundColor: cardColor }]}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Topic-wise Performance
            </Text>
            {result.topicPerformance.map((topic, index) => {
              const percentage = Math.round((topic.correct / topic.total) * 100);
              return (
                <View key={index} style={styles.topicItem}>
                  <View style={styles.topicHeader}>
                    <Text style={[styles.topicName, { color: textColor }]}>
                      {topic.topic}
                    </Text>
                    <Text style={[styles.topicScore, { color: textSecondaryColor }]}>
                      {topic.correct} / {topic.total}
                    </Text>
                  </View>
                  <View style={styles.topicProgressBar}>
                    <View
                      style={[
                        styles.topicProgress,
                        {
                          width: `${percentage}%`,
                          backgroundColor: getScoreColor(percentage),
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {result.weakAreas.length > 0 && (
          <View style={[styles.section, { backgroundColor: cardColor }]}>
            <View style={styles.weakAreasHeader}>
              <IconSymbol name="exclamationmark.triangle.fill" size={24} color={colors.warning} />
              <Text style={[styles.sectionTitle, { color: textColor, marginLeft: 8 }]}>
                Areas to Improve
              </Text>
            </View>
            <View style={styles.weakAreasList}>
              {result.weakAreas.map((area, index) => (
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
            <Text style={[styles.improvementTip, { color: textSecondaryColor }]}>
              Focus on reviewing these topics to improve your understanding.
            </Text>
          </View>
        )}

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/(tabs)/(home)/')}
          >
            <IconSymbol name="house.fill" size={20} color="#ffffff" />
            <Text style={styles.actionButtonText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.accent }]}
            onPress={() => router.push('/exam-config')}
          >
            <IconSymbol name="plus.circle.fill" size={20} color="#ffffff" />
            <Text style={styles.actionButtonText}>New Exam</Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  scoreCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  scoreCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  scorePercentage: {
    fontSize: 48,
    fontWeight: '700',
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 4,
  },
  scoreDetails: {
    width: '100%',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  scoreDetailLabel: {
    fontSize: 16,
  },
  scoreDetailValue: {
    fontSize: 16,
    fontWeight: '600',
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
    marginBottom: 12,
  },
  feedbackText: {
    fontSize: 16,
    lineHeight: 24,
  },
  topicItem: {
    marginBottom: 16,
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  topicName: {
    fontSize: 16,
    fontWeight: '500',
  },
  topicScore: {
    fontSize: 14,
  },
  topicProgressBar: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  topicProgress: {
    height: '100%',
    borderRadius: 4,
  },
  weakAreasHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  weakAreasList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  weakAreaBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  weakAreaText: {
    fontSize: 14,
    fontWeight: '500',
  },
  improvementTip: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 6,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
