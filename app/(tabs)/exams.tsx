
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

export default function ExamsScreen() {
  const { user, isAuthenticated, isDarkMode } = useApp();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  const bgColor = isDarkMode ? colors.backgroundDark : colors.background;
  const cardColor = isDarkMode ? colors.cardDark : colors.card;
  const textColor = isDarkMode ? colors.textDark : colors.text;
  const textSecondaryColor = isDarkMode ? colors.textSecondaryDark : colors.textSecondary;

  const exams = user?.exams || [];

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>My Exams</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => {
            if (user?.courseMaterials.length === 0) {
              alert('Please upload course materials first');
            } else {
              router.push('/exam-config');
            }
          }}
        >
          <IconSymbol name="plus" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          Platform.OS !== 'ios' && styles.scrollContentWithTabBar
        ]}
        showsVerticalScrollIndicator={false}
      >
        {exams.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol name="pencil" size={80} color={textSecondaryColor} />
            <Text style={[styles.emptyTitle, { color: textColor }]}>No Exams Yet</Text>
            <Text style={[styles.emptyDescription, { color: textSecondaryColor }]}>
              Create your first AI-generated exam
            </Text>
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: colors.primary }]}
              onPress={() => {
                if (user?.courseMaterials.length === 0) {
                  alert('Please upload course materials first');
                } else {
                  router.push('/exam-config');
                }
              }}
            >
              <Text style={styles.createButtonText}>Create Exam</Text>
            </TouchableOpacity>
          </View>
        ) : (
          exams.map((exam) => (
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
                <View style={styles.examTitleContainer}>
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
                        : 'Start'}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.examDetails}>
                <View style={styles.detailItem}>
                  <IconSymbol name="questionmark.circle" size={16} color={textSecondaryColor} />
                  <Text style={[styles.detailText, { color: textSecondaryColor }]}>
                    {exam.config.numberOfQuestions} questions
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <IconSymbol name="clock" size={16} color={textSecondaryColor} />
                  <Text style={[styles.detailText, { color: textSecondaryColor }]}>
                    {exam.config.duration} min
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <IconSymbol name="chart.bar" size={16} color={textSecondaryColor} />
                  <Text style={[styles.detailText, { color: textSecondaryColor }]}>
                    {exam.config.difficulty}
                  </Text>
                </View>
              </View>

              <View style={styles.examFooter}>
                <Text style={[styles.examType, { color: textSecondaryColor }]}>
                  {exam.config.examType === 'objective' ? 'Multiple Choice' : exam.config.examType === 'short-answer' ? 'Short Answer' : 'Essay'}
                </Text>
                <Text style={[styles.examDate, { color: textSecondaryColor }]}>
                  {new Date(exam.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </TouchableOpacity>
          ))
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
    elevation: 4,
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
    marginBottom: 24,
  },
  createButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  examCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  examHeader: {
    marginBottom: 12,
  },
  examTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  examTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  examDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 6,
  },
  examFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  examType: {
    fontSize: 14,
    fontWeight: '500',
  },
  examDate: {
    fontSize: 14,
  },
});
