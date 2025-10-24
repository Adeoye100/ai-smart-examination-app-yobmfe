
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { ExamType, DifficultyLevel, TimeIntensity, Exam, Question } from '@/types/exam';

export default function ExamConfigScreen() {
  const { user, addExam, isDarkMode } = useApp();
  const [examType, setExamType] = useState<ExamType>('objective');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('intermediate');
  const [timeIntensity, setTimeIntensity] = useState<TimeIntensity>('moderate');

  const bgColor = isDarkMode ? colors.backgroundDark : colors.background;
  const cardColor = isDarkMode ? colors.cardDark : colors.card;
  const textColor = isDarkMode ? colors.textDark : colors.text;
  const textSecondaryColor = isDarkMode ? colors.textSecondaryDark : colors.textSecondary;

  const getDuration = (): number => {
    const baseTime = examType === 'objective' ? 30 : examType === 'short-answer' ? 45 : 60;
    const multiplier = timeIntensity === 'relaxed' ? 1.5 : timeIntensity === 'moderate' ? 1 : 0.75;
    return Math.round(baseTime * multiplier);
  };

  const getNumberOfQuestions = (): number => {
    const base = examType === 'objective' ? 20 : examType === 'short-answer' ? 10 : 5;
    const difficultyMultiplier = difficulty === 'beginner' ? 0.8 : difficulty === 'intermediate' ? 1 : 1.2;
    return Math.round(base * difficultyMultiplier);
  };

  const generateExam = () => {
    if (!user || user.courseMaterials.length === 0) {
      Alert.alert('Error', 'Please upload course materials first');
      return;
    }

    const numberOfQuestions = getNumberOfQuestions();
    const questions: Question[] = [];

    // Generate mock questions based on exam type
    for (let i = 0; i < numberOfQuestions; i++) {
      if (examType === 'objective') {
        questions.push({
          id: `q${i + 1}`,
          type: 'objective',
          question: `Sample question ${i + 1} about the course material?`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: Math.floor(Math.random() * 4),
          points: 1,
          topic: user.courseMaterials[0].extractedTopics?.[i % (user.courseMaterials[0].extractedTopics?.length || 1)] || 'General',
        });
      } else if (examType === 'short-answer') {
        questions.push({
          id: `q${i + 1}`,
          type: 'short-answer',
          question: `Explain the concept related to question ${i + 1}.`,
          points: 2,
          topic: user.courseMaterials[0].extractedTopics?.[i % (user.courseMaterials[0].extractedTopics?.length || 1)] || 'General',
        });
      } else {
        questions.push({
          id: `q${i + 1}`,
          type: 'essay',
          question: `Write a detailed essay about topic ${i + 1} from the course material.`,
          points: 5,
          topic: user.courseMaterials[0].extractedTopics?.[i % (user.courseMaterials[0].extractedTopics?.length || 1)] || 'General',
        });
      }
    }

    const exam: Exam = {
      id: Date.now().toString(),
      title: `${user.courseMaterials[0].name} - ${examType} Exam`,
      courseMaterialId: user.courseMaterials[0].id,
      config: {
        examType,
        difficulty,
        timeIntensity,
        duration: getDuration(),
        numberOfQuestions,
      },
      questions,
      createdAt: new Date(),
      status: 'pending',
    };

    addExam(exam);
    Alert.alert('Success', 'Exam generated successfully!', [
      {
        text: 'Start Now',
        onPress: () => router.replace(`/exam?id=${exam.id}`),
      },
      {
        text: 'Later',
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: textColor }]}>Configure Your Exam</Text>
        <Text style={[styles.subtitle, { color: textSecondaryColor }]}>
          Customize the exam settings to match your learning goals
        </Text>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Exam Type</Text>
          
          <TouchableOpacity
            style={[
              styles.optionCard,
              { backgroundColor: cardColor },
              examType === 'objective' && { borderColor: colors.primary, borderWidth: 2 },
            ]}
            onPress={() => setExamType('objective')}
          >
            <IconSymbol
              name="checkmark.circle.fill"
              size={32}
              color={examType === 'objective' ? colors.primary : textSecondaryColor}
            />
            <View style={styles.optionContent}>
              <Text style={[styles.optionTitle, { color: textColor }]}>Multiple Choice</Text>
              <Text style={[styles.optionDescription, { color: textSecondaryColor }]}>
                Quick assessment with objective questions
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionCard,
              { backgroundColor: cardColor },
              examType === 'short-answer' && { borderColor: colors.primary, borderWidth: 2 },
            ]}
            onPress={() => setExamType('short-answer')}
          >
            <IconSymbol
              name="text.alignleft"
              size={32}
              color={examType === 'short-answer' ? colors.primary : textSecondaryColor}
            />
            <View style={styles.optionContent}>
              <Text style={[styles.optionTitle, { color: textColor }]}>Short Answer</Text>
              <Text style={[styles.optionDescription, { color: textSecondaryColor }]}>
                Brief written responses to questions
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionCard,
              { backgroundColor: cardColor },
              examType === 'essay' && { borderColor: colors.primary, borderWidth: 2 },
            ]}
            onPress={() => setExamType('essay')}
          >
            <IconSymbol
              name="doc.text.fill"
              size={32}
              color={examType === 'essay' ? colors.primary : textSecondaryColor}
            />
            <View style={styles.optionContent}>
              <Text style={[styles.optionTitle, { color: textColor }]}>Essay</Text>
              <Text style={[styles.optionDescription, { color: textSecondaryColor }]}>
                Detailed written analysis and discussion
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Difficulty Level</Text>
          
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[
                styles.groupButton,
                { backgroundColor: difficulty === 'beginner' ? colors.primary : cardColor },
              ]}
              onPress={() => setDifficulty('beginner')}
            >
              <Text
                style={[
                  styles.groupButtonText,
                  { color: difficulty === 'beginner' ? '#ffffff' : textColor },
                ]}
              >
                Beginner
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.groupButton,
                { backgroundColor: difficulty === 'intermediate' ? colors.primary : cardColor },
              ]}
              onPress={() => setDifficulty('intermediate')}
            >
              <Text
                style={[
                  styles.groupButtonText,
                  { color: difficulty === 'intermediate' ? '#ffffff' : textColor },
                ]}
              >
                Intermediate
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.groupButton,
                { backgroundColor: difficulty === 'advanced' ? colors.primary : cardColor },
              ]}
              onPress={() => setDifficulty('advanced')}
            >
              <Text
                style={[
                  styles.groupButtonText,
                  { color: difficulty === 'advanced' ? '#ffffff' : textColor },
                ]}
              >
                Advanced
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Time Intensity</Text>
          
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[
                styles.groupButton,
                { backgroundColor: timeIntensity === 'relaxed' ? colors.success : cardColor },
              ]}
              onPress={() => setTimeIntensity('relaxed')}
            >
              <Text
                style={[
                  styles.groupButtonText,
                  { color: timeIntensity === 'relaxed' ? '#ffffff' : textColor },
                ]}
              >
                Relaxed
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.groupButton,
                { backgroundColor: timeIntensity === 'moderate' ? colors.warning : cardColor },
              ]}
              onPress={() => setTimeIntensity('moderate')}
            >
              <Text
                style={[
                  styles.groupButtonText,
                  { color: timeIntensity === 'moderate' ? '#ffffff' : textColor },
                ]}
              >
                Moderate
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.groupButton,
                { backgroundColor: timeIntensity === 'challenging' ? colors.secondary : cardColor },
              ]}
              onPress={() => setTimeIntensity('challenging')}
            >
              <Text
                style={[
                  styles.groupButtonText,
                  { color: timeIntensity === 'challenging' ? '#ffffff' : textColor },
                ]}
              >
                Challenging
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: cardColor }]}>
          <Text style={[styles.summaryTitle, { color: textColor }]}>Exam Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: textSecondaryColor }]}>Questions:</Text>
            <Text style={[styles.summaryValue, { color: textColor }]}>
              {getNumberOfQuestions()}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: textSecondaryColor }]}>Duration:</Text>
            <Text style={[styles.summaryValue, { color: textColor }]}>
              {getDuration()} minutes
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.generateButton, { backgroundColor: colors.primary }]}
          onPress={generateExam}
        >
          <Text style={styles.generateButtonText}>Generate Exam</Text>
        </TouchableOpacity>
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
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  optionContent: {
    flex: 1,
    marginLeft: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  groupButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  groupButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  summaryCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  generateButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  generateButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
