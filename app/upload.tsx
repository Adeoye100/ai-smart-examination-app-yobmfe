
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from '@/contexts/AppContext';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { CourseMaterial } from '@/types/exam';

export default function UploadScreen() {
  const { addCourseMaterial, isDarkMode } = useApp();
  const [uploadType, setUploadType] = useState<'file' | 'text' | null>(null);
  const [textContent, setTextContent] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const bgColor = isDarkMode ? colors.backgroundDark : colors.background;
  const cardColor = isDarkMode ? colors.cardDark : colors.card;
  const textColor = isDarkMode ? colors.textDark : colors.text;
  const textSecondaryColor = isDarkMode ? colors.textSecondaryDark : colors.textSecondary;
  const inputStyle = isDarkMode ? styles.inputDark : styles.input;

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
        console.log('Document selected:', result.assets[0]);
      }
    } catch (error) {
      console.log('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow access to your photo library');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
        console.log('Image selected:', result.assets[0]);
      }
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleUpload = () => {
    if (uploadType === 'file' && !selectedFile) {
      Alert.alert('Error', 'Please select a file');
      return;
    }

    if (uploadType === 'text' && (!textContent || !courseTitle)) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Simulate topic extraction
    const extractedTopics = generateMockTopics();

    const material: CourseMaterial = {
      id: Date.now().toString(),
      name: uploadType === 'file' ? selectedFile.name : courseTitle,
      type: uploadType === 'file' ? getFileType(selectedFile.name) : 'text',
      uri: uploadType === 'file' ? selectedFile.uri : undefined,
      content: uploadType === 'text' ? textContent : undefined,
      uploadedAt: new Date(),
      extractedTopics,
    };

    addCourseMaterial(material);
    Alert.alert('Success', 'Course material uploaded successfully', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const getFileType = (filename: string): 'pdf' | 'doc' | 'image' | 'text' => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'pdf';
    if (ext === 'doc' || ext === 'docx') return 'doc';
    if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') return 'image';
    return 'text';
  };

  const generateMockTopics = (): string[] => {
    const topics = [
      'Introduction',
      'Core Concepts',
      'Advanced Topics',
      'Practical Applications',
      'Case Studies',
      'Best Practices',
      'Common Pitfalls',
      'Future Trends',
    ];
    return topics.slice(0, Math.floor(Math.random() * 5) + 3);
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {!uploadType ? (
          <>
            <Text style={[styles.title, { color: textColor }]}>Upload Course Material</Text>
            <Text style={[styles.subtitle, { color: textSecondaryColor }]}>
              Choose how you want to add your course content
            </Text>

            <TouchableOpacity
              style={[styles.optionCard, { backgroundColor: cardColor }]}
              onPress={() => setUploadType('file')}
            >
              <IconSymbol name="doc.fill" size={48} color={colors.primary} />
              <Text style={[styles.optionTitle, { color: textColor }]}>Upload File</Text>
              <Text style={[styles.optionDescription, { color: textSecondaryColor }]}>
                PDF, Word documents, or images
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionCard, { backgroundColor: cardColor }]}
              onPress={() => setUploadType('text')}
            >
              <IconSymbol name="text.alignleft" size={48} color={colors.accent} />
              <Text style={[styles.optionTitle, { color: textColor }]}>Enter Text</Text>
              <Text style={[styles.optionDescription, { color: textSecondaryColor }]}>
                Type or paste course outline and notes
              </Text>
            </TouchableOpacity>
          </>
        ) : uploadType === 'file' ? (
          <>
            <Text style={[styles.title, { color: textColor }]}>Select File</Text>
            
            {selectedFile ? (
              <View style={[styles.selectedFileCard, { backgroundColor: cardColor }]}>
                <IconSymbol name="checkmark.circle.fill" size={48} color={colors.success} />
                <Text style={[styles.selectedFileName, { color: textColor }]}>
                  {selectedFile.name}
                </Text>
                <TouchableOpacity onPress={() => setSelectedFile(null)}>
                  <Text style={[styles.changeFile, { color: colors.primary }]}>
                    Change File
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.uploadButton, { backgroundColor: colors.primary }]}
                  onPress={pickDocument}
                >
                  <IconSymbol name="doc.fill" size={24} color="#ffffff" />
                  <Text style={styles.uploadButtonText}>Pick Document</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.uploadButton, { backgroundColor: colors.accent }]}
                  onPress={pickImage}
                >
                  <IconSymbol name="photo.fill" size={24} color="#ffffff" />
                  <Text style={styles.uploadButtonText}>Pick Image</Text>
                </TouchableOpacity>
              </>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton, { borderColor: textSecondaryColor }]}
                onPress={() => {
                  setUploadType(null);
                  setSelectedFile(null);
                }}
              >
                <Text style={[styles.cancelButtonText, { color: textColor }]}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.submitButton, { backgroundColor: colors.primary }]}
                onPress={handleUpload}
                disabled={!selectedFile}
              >
                <Text style={styles.submitButtonText}>Upload</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={[styles.title, { color: textColor }]}>Enter Course Content</Text>
            
            <TextInput
              style={[inputStyle, { color: textColor }]}
              placeholder="Course Title"
              placeholderTextColor={textSecondaryColor}
              value={courseTitle}
              onChangeText={setCourseTitle}
            />

            <TextInput
              style={[inputStyle, styles.textArea, { color: textColor }]}
              placeholder="Course outline, topics, or notes..."
              placeholderTextColor={textSecondaryColor}
              value={textContent}
              onChangeText={setTextContent}
              multiline
              numberOfLines={10}
              textAlignVertical="top"
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton, { borderColor: textSecondaryColor }]}
                onPress={() => {
                  setUploadType(null);
                  setTextContent('');
                  setCourseTitle('');
                }}
              >
                <Text style={[styles.cancelButtonText, { color: textColor }]}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.submitButton, { backgroundColor: colors.primary }]}
                onPress={handleUpload}
              >
                <Text style={styles.submitButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
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
  optionCard: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    textAlign: 'center',
  },
  selectedFileCard: {
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  selectedFileName: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  changeFile: {
    fontSize: 14,
    fontWeight: '600',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  uploadButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  inputDark: {
    backgroundColor: colors.cardDark,
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    height: 200,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    borderWidth: 2,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
