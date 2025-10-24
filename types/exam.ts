
export type ExamType = 'objective' | 'short-answer' | 'essay';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type TimeIntensity = 'relaxed' | 'moderate' | 'challenging';

export interface CourseMaterial {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'image' | 'text';
  uri?: string;
  content?: string;
  uploadedAt: Date;
  extractedTopics?: string[];
}

export interface Question {
  id: string;
  type: ExamType;
  question: string;
  options?: string[]; // For objective questions
  correctAnswer?: string | number; // For objective questions
  userAnswer?: string | number;
  points: number;
  topic?: string;
}

export interface ExamConfig {
  examType: ExamType;
  difficulty: DifficultyLevel;
  timeIntensity: TimeIntensity;
  duration: number; // in minutes
  numberOfQuestions: number;
}

export interface Exam {
  id: string;
  title: string;
  courseMaterialId?: string;
  config: ExamConfig;
  questions: Question[];
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface ExamResult {
  examId: string;
  score: number;
  totalPoints: number;
  accuracy: number;
  topicPerformance: {
    topic: string;
    correct: number;
    total: number;
  }[];
  feedback: string;
  weakAreas: string[];
  completedAt: Date;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  courseMaterials: CourseMaterial[];
  exams: Exam[];
  results: ExamResult[];
}
