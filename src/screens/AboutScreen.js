/**
 * About Screen Component
 * Displays app information, version details, and developer credits
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { APP_INFO } from '../constants/appConstants';

const AboutScreen = ({ onBack }) => {
  const { theme } = useTheme();

  const openExternalURL = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to open this link on your device');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open the link');
      console.error('Error opening URL:', error);
    }
  };

  const features = [
    {
      icon: 'calculator-outline',
      title: 'Accurate Calculations',
      description: 'ATO-compliant tax calculations for Australian residents',
    },
    {
      icon: 'document-text-outline',
      title: 'Professional Reports',
      description: 'Generate detailed PDF reports for your records',
    },
    {
      icon: 'save-outline',
      title: 'Save & Track',
      description: 'Save multiple calculations and track your progress',
    },
    {
      icon: 'shield-checkmark-outline',
      title: 'Secure & Private',
      description: 'Your data stays on your device - complete privacy',
    },
  ];

  const links = [
    {
      icon: 'globe-outline',
      title: 'Australian Taxation Office',
      subtitle: 'Official ATO website',
      url: 'https://www.ato.gov.au',
    },
    {
      icon: 'document-outline',
      title: 'Tax Guide 2024-25',
      subtitle: 'Complete tax guide for individuals',
      url: 'https://www.ato.gov.au/individuals/income-and-deductions',
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      paddingTop: 60,
      paddingHorizontal: 20,
      paddingBottom: 20,
      backgroundColor: theme.primary,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    backButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    headerTextContainer: {
      flex: 1,
      alignItems: 'center',
      marginHorizontal: 16,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#FFFFFF',
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.8)',
      fontWeight: '500',
    },
    scrollContainer: {
      flex: 1,
    },
    content: {
      padding: 20,
    },
    appInfoSection: {
      alignItems: 'center',
      marginBottom: 32,
    },
    appIcon: {
      width: 80,
      height: 80,
      borderRadius: 20,
      backgroundColor: theme.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      borderWidth: 2,
      borderColor: theme.primaryBorder,
    },
    appName: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    appVersion: {
      fontSize: 16,
      color: theme.textSecondary,
      marginBottom: 4,
    },
    appDescription: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
      marginTop: 8,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 16,
      marginTop: 8,
    },
    featuresContainer: {
      marginBottom: 32,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: theme.surface,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    featureIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    featureContent: {
      flex: 1,
    },
    featureTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
    },
    featureDescription: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 18,
    },
    linksContainer: {
      marginBottom: 32,
    },
    linkItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    linkIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.accentLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    linkContent: {
      flex: 1,
    },
    linkTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 2,
    },
    linkSubtitle: {
      fontSize: 13,
      color: theme.textSecondary,
    },
    linkArrow: {
      marginLeft: 8,
    },
    footer: {
      alignItems: 'center',
      paddingVertical: 24,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      backgroundColor: theme.surfaceSecondary,
    },
    footerText: {
      fontSize: 12,
      color: theme.textTertiary,
      textAlign: 'center',
      lineHeight: 16,
    },
    copyright: {
      fontWeight: '600',
      color: theme.textSecondary,
    },
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>About</Text>
            <Text style={styles.headerSubtitle}>App Information</Text>
          </View>
          <View style={{ width: 36 }} />
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* App Info Section */}
          <View style={styles.appInfoSection}>
            <View style={styles.appIcon}>
              <Ionicons name="calculator" size={40} color={theme.primary} />
            </View>
            <Text style={styles.appName}>{APP_INFO.NAME}</Text>
            <Text style={styles.appVersion}>Version {APP_INFO.VERSION}</Text>
            <Text style={styles.appDescription}>
              Professional Australian tax calculator designed to help you accurately
              calculate your tax return for the {APP_INFO.FINANCIAL_YEAR} financial year.
              Simple, secure, and ATO-compliant.
            </Text>
          </View>

          {/* Features Section */}
          <View style={styles.featuresContainer}>
            <Text style={styles.sectionTitle}>Key Features</Text>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Ionicons name={feature.icon} size={20} color={theme.primary} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Useful Links Section */}
          <View style={styles.linksContainer}>
            <Text style={styles.sectionTitle}>Useful Links</Text>
            {links.map((link, index) => (
              <TouchableOpacity
                key={index}
                style={styles.linkItem}
                onPress={() => openExternalURL(link.url)}
                activeOpacity={0.7}
              >
                <View style={styles.linkIcon}>
                  <Ionicons name={link.icon} size={20} color={theme.accent} />
                </View>
                <View style={styles.linkContent}>
                  <Text style={styles.linkTitle}>{link.title}</Text>
                  <Text style={styles.linkSubtitle}>{link.subtitle}</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.textSecondary}
                  style={styles.linkArrow}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            <Text style={styles.copyright}>© 2024 Tax Calculator</Text>
            {'\n'}Made with ❤️ for Australian taxpayers
            {'\n'}All calculations are estimates only
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default AboutScreen;
