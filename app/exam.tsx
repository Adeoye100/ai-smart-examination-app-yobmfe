
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { ExamResult } from '@/types/exam';

export default function ExamScreen() {
  const { id } = useLocalSearchParams();
  const { getExamById, updateExam, addExamResult, isDarkMode } = useApp();
  const exam = getExamById(id as string);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string | number }>({});
  const [timeRemaining, setTimeRemaining] = useState(exam?.config.duration ? exam.config.duration * 60 : 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bgColor = isDarkMode ? colors.backgroundDark : colors.background;
  const cardColor = isDarkMode ? colors.cardDark : colors.card;
  const textColor = isDarkMode ? colors.textDark : colors.text;
  const textSecondaryColor = isDarkMode ? colors.textSecondaryDark : colors.textSecondary;

  useEffect(() => {
    if (!exam) {
      Alert.alert('Error', 'Exam not found', [
        { text: 'OK', onPress: () => router.back() },
      ]);
      return;
    }

    if (exam.status === 'pending') {
      updateExam(exam.id, { status: 'in-progress', startedAt: new Date() });
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!exam) {
    return null;
  }

  const currentQuestion = exam.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / exam.questions.length) * 100;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (answer: string | number) => {
    setAnswers({ ...answers, [currentQuestion.id]: answer });
  };

  const handleNext = () => {
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Calculate score
    let score = 0;
    let totalPoints = 0;
    const topicPerformance: { [key: string]: { correct: number; total: number } } = {};

    exam.questions.forEach((question) => {
      totalPoints += question.points;
      const topic = question.topic || 'General';

      if (!topicPerformance[topic]) {
        topicPerformance[topic] = { correct: 0, total: 0 };
      }
      topicPerformance[topic].total++;

      if (question.type === 'objective') {
        if (answers[question.id] === question.correctAnswer) {
          score += question.points;
          topicPerformance[topic].correct++;
        }
      } else {
        // For short-answer and essay, give partial credit based on answer length
        const answer = answers[question.id] as string;
        if (answer && answer.length > 20) {
          const partialScore = Math.min(question.points, question.points * 0.7);
          score += partialScore;
          topicPerformance[topic].correct += 0.7;
        }
      }
    });

    const accuracy = Math.round((score / totalPoints) * 100);

    // Identify weak areas
    const weakAreas = Object.entries(topicPerformance)
      .filter(([_, perf]) => perf.correct / perf.total < 0.6)
      .map(([topic]) => topic);

    const result: ExamResult = {
      examId: exam.id,
      score,
      totalPoints,
      accuracy,
      topicPerformance: Object.entries(topicPerformance).map(([topic, perf]) => ({
        topic,
        correct: Math.round(perf.correct),
        total: perf.total,
      })),
      feedback: generateFeedback(accuracy, weakAreas),
      weakAreas,
      completedAt: new Date(),
    };

    updateExam(exam.id, { status: 'completed', completedAt: new Date() });
    addExamResult(result);

    router.replace(`/results?id=${exam.id}`);
  };

  const generateFeedback = (accuracy: number, weakAreas: string[]): string => {
    if (accuracy >= 90) {
      return 'Excellent work! You have demonstrated a strong understanding of the material.';
    } else if (accuracy >= 75) {
      return 'Good job! You have a solid grasp of most concepts. Focus on the weak areas to improve further.';
    } else if (accuracy >= 60) {
      return 'Fair performance. Review the material, especially in the weak areas, to strengthen your understanding.';
    } else {
      return 'You may need to review the course material more thoroughly. Focus on understanding the core concepts.';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={[styles.header, { backgroundColor: cardColor }]}>
        <View style={styles.headerTop}>
          <View style={styles.timerContainer}>
            <IconSymbol name="clock" size={20} color={timeRemaining < 300 ? colors.error : colors.primary} />
            <Text style={[styles.timer, { color: timeRemaining < 300 ? colors.error : textColor }]}>
              {formatTime(timeRemaining)}
            </Text>
          </View>
          <Text style={[styles.questionCounter, { color: textColor }]}>
            {currentQuestionIndex + 1} / {exam.questions.length}
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: colors.primary }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.questionCard, { backgroundColor: cardColor }]}>
          <View style={styles.questionHeader}>
            <Text style={[styles.questionNumber, { color: textSecondaryColor }]}>
              Question {currentQuestionIndex + 1}
            </Text>
            {currentQuestion.topic && (
              <View style={[styles.topicBadge, { backgroundColor: colors.highlight }]}>
                <Text style={[styles.topicText, { color: colors.primary }]}>
                  {currentQuestion.topic}
                </Text>
              </View>
            )}
          </View>
          <Text style={[styles.questionText, { color: textColor }]}>
            {currentQuestion.question}
          </Text>

          {currentQuestion.type === 'objective' && currentQuestion.options && (
            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    { backgroundColor: bgColor },
                    answers[currentQuestion.id] === index && {
                      backgroundColor: colors.primary,
                      borderColor: colors.primary,
                    },
                  ]}
                  onPress={() => handleAnswer(index)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: textColor },
                      answers[currentQuestion.id] === index && { color: '#ffffff' },
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {(currentQuestion.type === 'short-answer' || currentQuestion.type === 'essay') && (
            <TextInput
              style={[
                styles.answerInput,
                { backgroundColor: bgColor, color: textColor, borderColor: isDarkMode ? colors.borderDark : colors.border },
                currentQuestion.type === 'essay' && styles.essayInput,
              ]}
              placeholder="Type your answer here..."
              placeholderTextColor={textSecondaryColor}
              value={(answers[currentQuestion.id] as string) || ''}
              onChangeText={(text) => handleAnswer(text)}
              multiline
              numberOfLines={currentQuestion.type === 'essay' ? 10 : 4}
              textAlignVertical="top"
            />
          )}
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: cardColor }]}>
        <TouchableOpacity
          style={[
            styles.navButton,
            { backgroundColor: bgColor },
            currentQuestionIndex === 0 && styles.navButtonDisabled,
          ]}
          onPress={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <IconSymbol name="chevron.left" size={20} color={currentQuestionIndex === 0 ? colors.disabled : textColor} />
          <Text style={[styles.navButtonText, { color: currentQuestionIndex === 0 ? colors.disabled : textColor }]}>
            Previous
          </Text>
        </TouchableOpacity>

        {currentQuestionIndex === exam.questions.length - 1 ? (
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: colors.success }]}
            onPress={() => {
              Alert.alert(
                'Submit Exam',
                'Are you sure you want to submit your exam?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Submit', onPress: handleSubmit },
                ]
              );
            }}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: colors.primary }]}
            onPress={handleNext}
          >
            <Text style={[styles.navButtonText, { color: '#ffffff' }]}>Next</Text>
            <IconSymbol name="chevron.right" size={20} color="#ffffff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 60,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timer: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  questionCounter: {
    fontSize: 16,
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  scrollContent: {
    padding: 20,
  },
  questionCard: {
    padding: 20,
    borderRadius: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '500',
  },
  topicBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  topicText: {
    fontSize: 12,
    fontWeight: '600',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 26,
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  optionText: {
    fontSize: 16,
  },
  answerInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
  },
  essayInput: {
    minHeight: 200,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    boxShadow: '0px -2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 120,
    justifyContent: 'center',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 8,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
