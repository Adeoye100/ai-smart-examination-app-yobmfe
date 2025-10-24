
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

export default function MaterialsScreen() {
  const { user, isAuthenticated, isDarkMode } = useApp();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  const bgColor = isDarkMode ? colors.backgroundDark : colors.background;
  const cardColor = isDarkMode ? colors.cardDark : colors.card;
  const textColor = isDarkMode ? colors.textDark : colors.text;
  const textSecondaryColor = isDarkMode ? colors.textSecondaryDark : colors.textSecondary;

  const materials = user?.courseMaterials || [];

  const getIconForType = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'doc.fill';
      case 'doc':
        return 'doc.text.fill';
      case 'image':
        return 'photo.fill';
      case 'text':
        return 'text.alignleft';
      default:
        return 'doc.fill';
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case 'pdf':
        return colors.secondary;
      case 'doc':
        return colors.primary;
      case 'image':
        return colors.accent;
      case 'text':
        return colors.success;
      default:
        return colors.primary;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Course Materials</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/upload')}
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
        {materials.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol name="doc.fill" size={80} color={textSecondaryColor} />
            <Text style={[styles.emptyTitle, { color: textColor }]}>No Materials Yet</Text>
            <Text style={[styles.emptyDescription, { color: textSecondaryColor }]}>
              Upload your course materials to get started
            </Text>
            <TouchableOpacity
              style={[styles.uploadButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/upload')}
            >
              <Text style={styles.uploadButtonText}>Upload Material</Text>
            </TouchableOpacity>
          </View>
        ) : (
          materials.map((material) => (
            <View
              key={material.id}
              style={[styles.materialCard, { backgroundColor: cardColor }]}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: getColorForType(material.type) },
                ]}
              >
                <IconSymbol
                  name={getIconForType(material.type)}
                  size={28}
                  color="#ffffff"
                />
              </View>
              <View style={styles.materialContent}>
                <Text style={[styles.materialName, { color: textColor }]}>
                  {material.name}
                </Text>
                <Text style={[styles.materialType, { color: textSecondaryColor }]}>
                  {material.type.toUpperCase()} • {new Date(material.uploadedAt).toLocaleDateString()}
                </Text>
                {material.extractedTopics && material.extractedTopics.length > 0 && (
                  <View style={styles.topicsContainer}>
                    {material.extractedTopics.slice(0, 3).map((topic, index) => (
                      <View
                        key={index}
                        style={[styles.topicBadge, { backgroundColor: colors.highlight }]}
                      >
                        <Text style={[styles.topicText, { color: colors.primary }]}>
                          {topic}
                        </Text>
                      </View>
                    ))}
                    {material.extractedTopics.length > 3 && (
                      <Text style={[styles.moreTopics, { color: textSecondaryColor }]}>
                        +{material.extractedTopics.length - 3} more
                      </Text>
                    )}
                  </View>
                )}
              </View>
            </View>
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
  uploadButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  uploadButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  materialCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  materialContent: {
    flex: 1,
  },
  materialName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  materialType: {
    fontSize: 14,
    marginBottom: 8,
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  topicBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
    marginTop: 4,
  },
  topicText: {
    fontSize: 12,
    fontWeight: '500',
  },
  moreTopics: {
    fontSize: 12,
    marginTop: 4,
  },
});
