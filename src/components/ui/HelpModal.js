/**
 * HelpModal Component
 * A reusable modal for displaying help information
 */

import React from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  ScrollView, 
  TouchableWithoutFeedback 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const HelpModal = ({ visible, onClose, helpData }) => {
  const { theme } = useTheme();

  if (!helpData) return null;

  const styles = {
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    content: {
      backgroundColor: theme.surface,
      borderRadius: 16,
      padding: 24,
      maxWidth: '100%',
      width: '100%',
      maxHeight: '80%',
      elevation: 10,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.text,
      flex: 1,
    },
    closeButton: {
      padding: 4,
    },
    scrollView: {
      maxHeight: 400,
    },
    section: {
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 6,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    sectionText: {
      fontSize: 15,
      color: theme.textSecondary,
      lineHeight: 22,
      marginBottom: 8,
    },
    examplesList: {
      marginLeft: 12,
    },
    exampleItem: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 4,
      lineHeight: 20,
    },
    tipsList: {
      marginLeft: 12,
    },
    tipItem: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 6,
      lineHeight: 20,
    },
    whereToFind: {
      backgroundColor: theme.primaryLight,
      padding: 12,
      borderRadius: 8,
      borderLeftWidth: 3,
      borderLeftColor: theme.primary,
    },
    whereToFindText: {
      fontSize: 14,
      color: theme.text,
      fontStyle: 'italic',
      lineHeight: 20,
    },
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.content}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>{helpData.title}</Text>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Purpose */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Purpose</Text>
                  <Text style={styles.sectionText}>{helpData.purpose}</Text>
                </View>

                {/* Examples */}
                {helpData.examples && helpData.examples.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Examples</Text>
                    <View style={styles.examplesList}>
                      {helpData.examples.map((example, index) => (
                        <Text key={index} style={styles.exampleItem}>
                          • {example}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}

                {/* Tips */}
                {helpData.tips && helpData.tips.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Important Tips</Text>
                    <View style={styles.tipsList}>
                      {helpData.tips.map((tip, index) => (
                        <Text key={index} style={styles.tipItem}>
                          • {tip}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}

                {/* Where to Find */}
                {helpData.whereToFind && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Where to Find This Information</Text>
                    <View style={styles.whereToFind}>
                      <Text style={styles.whereToFindText}>
                        {helpData.whereToFind}
                      </Text>
                    </View>
                  </View>
                )}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default HelpModal;
