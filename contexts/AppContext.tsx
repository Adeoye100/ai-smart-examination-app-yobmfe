
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CourseMaterial, Exam, ExamResult, UserProfile } from '@/types/exam';

interface AppContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isDarkMode: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  toggleTheme: () => void;
  addCourseMaterial: (material: CourseMaterial) => void;
  addExam: (exam: Exam) => void;
  updateExam: (examId: string, updates: Partial<Exam>) => void;
  addExamResult: (result: ExamResult) => void;
  getExamById: (examId: string) => Exam | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadUserData();
    loadThemePreference();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  const loadThemePreference = async () => {
    try {
      const theme = await AsyncStorage.getItem('theme');
      if (theme === 'dark') {
        setIsDarkMode(true);
      }
    } catch (error) {
      console.log('Error loading theme preference:', error);
    }
  };

  const saveUserData = async (userData: UserProfile) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.log('Error saving user data:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate login - in real app, this would call an API
    try {
      const storedUsers = await AsyncStorage.getItem('users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      
      if (foundUser) {
        const userProfile: UserProfile = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          courseMaterials: foundUser.courseMaterials || [],
          exams: foundUser.exams || [],
          results: foundUser.results || [],
        };
        setUser(userProfile);
        setIsAuthenticated(true);
        await saveUserData(userProfile);
        return true;
      }
      return false;
    } catch (error) {
      console.log('Login error:', error);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const storedUsers = await AsyncStorage.getItem('users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      // Check if user already exists
      if (users.find((u: any) => u.email === email)) {
        return false;
      }
      
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        courseMaterials: [],
        exams: [],
        results: [],
      };
      
      users.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(users));
      
      const userProfile: UserProfile = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        courseMaterials: [],
        exams: [],
        results: [],
      };
      
      setUser(userProfile);
      setIsAuthenticated(true);
      await saveUserData(userProfile);
      return true;
    } catch (error) {
      console.log('Signup error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  const addCourseMaterial = (material: CourseMaterial) => {
    if (user) {
      const updatedUser = {
        ...user,
        courseMaterials: [...user.courseMaterials, material],
      };
      setUser(updatedUser);
      saveUserData(updatedUser);
    }
  };

  const addExam = (exam: Exam) => {
    if (user) {
      const updatedUser = {
        ...user,
        exams: [...user.exams, exam],
      };
      setUser(updatedUser);
      saveUserData(updatedUser);
    }
  };

  const updateExam = (examId: string, updates: Partial<Exam>) => {
    if (user) {
      const updatedExams = user.exams.map(exam =>
        exam.id === examId ? { ...exam, ...updates } : exam
      );
      const updatedUser = {
        ...user,
        exams: updatedExams,
      };
      setUser(updatedUser);
      saveUserData(updatedUser);
    }
  };

  const addExamResult = (result: ExamResult) => {
    if (user) {
      const updatedUser = {
        ...user,
        results: [...user.results, result],
      };
      setUser(updatedUser);
      saveUserData(updatedUser);
    }
  };

  const getExamById = (examId: string): Exam | undefined => {
    return user?.exams.find(exam => exam.id === examId);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        isDarkMode,
        login,
        signup,
        logout,
        toggleTheme,
        addCourseMaterial,
        addExam,
        updateExam,
        addExamResult,
        getExamById,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
