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
  Platform,
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

  const legalSections = [
    {
      title: 'Privacy Policy',
      content: [
        'This application does not collect, store, or transmit any personal data to external servers. All calculations and data remain on your device only.',
        'No personal information, tax details, or usage data is shared with third parties. Your privacy is completely protected.',
        'The app may access device storage only to save your calculations locally for your convenience. No data leaves your device.',
      ],
    },
    {
      title: 'Important Disclaimer',
      content: [
        'This application is NOT affiliated with the Australian Taxation Office (ATO). This app is NOT operated by a registered tax agent.',
        'All calculations are estimates only and should not be considered as professional tax advice. Results may not reflect your actual tax liability or refund amount.',
        'The developers assume no responsibility for any financial decisions made based on the calculations provided by this application.',
      ],
    },
    {
      title: 'Professional Advice',
      content: [
        'For final accuracy and compliance, consult a registered tax agent. Tax laws are complex and subject to change.',
        'Individual circumstances may affect your tax obligations in ways this calculator cannot account for.',
        'This tool is designed for general guidance only and should be used as a starting point for your tax planning.',
      ],
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
      paddingTop: Platform.OS === 'ios' ? 44 : 0,
      paddingHorizontal: 20,
      paddingBottom: 16,
      backgroundColor: 'transparent',
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.surface,
      borderWidth: 1.5,
      borderColor: theme.border,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    headerTextContainer: {
      flex: 1,
      alignItems: 'center',
      marginHorizontal: 16,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.text,
      letterSpacing: 0.2,
      marginBottom: 2,
    },
    headerSubtitle: {
      fontSize: 16,
      color: theme.primary,
      fontWeight: '500',
      letterSpacing: 0.1,
    },
    scrollContainer: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      paddingTop: 8,
      paddingBottom: 40,
    },
    appInfoSection: {
      backgroundColor: theme.surface,
      marginHorizontal: 20,
      marginTop: 0,
      marginBottom: 20,
      borderRadius: 16,
      padding: 24,
      borderWidth: 1,
      borderColor: theme.border,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      alignItems: 'center',
    },
    appName: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 8,
      textAlign: 'center',
      letterSpacing: 0.3,
    },
    appVersion: {
      fontSize: 16,
      color: theme.textSecondary,
      marginBottom: 4,
      fontWeight: '500',
    },
    appDescription: {
      fontSize: 15,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      marginTop: 12,
      marginBottom: 16,
    },
    disclaimerBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.warningLight,
      borderWidth: 1,
      borderColor: theme.warningBorder,
      borderRadius: 12,
      padding: 16,
      marginTop: 8,
      elevation: 1,
      shadowColor: theme.warning,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    disclaimerText: {
      fontSize: 13,
      color: theme.warning,
      fontWeight: '600',
      marginLeft: 8,
      textAlign: 'center',
      flex: 1,
      letterSpacing: 0.1,
    },
    sectionTitle: {
      fontSize: 17,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 16,
      marginTop: 8,
      letterSpacing: 0.1,
      paddingHorizontal: 20,
    },
    legalContainer: {
      marginBottom: 20,
    },
    legalSection: {
      backgroundColor: theme.surface,
      marginHorizontal: 20,
      marginBottom: 16,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: theme.border,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
    },
    legalTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.text,
      letterSpacing: 0.2,
      marginBottom: 16,
    },
    legalContent: {
      gap: 12,
    },
    legalParagraph: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 22,
      letterSpacing: 0.1,
      marginBottom: 12,
    },
    linksContainer: {
      marginBottom: 20,
    },
    linkItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      marginHorizontal: 20,
      marginBottom: 12,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.border,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
    },
    linkIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.accentLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
      borderWidth: 1,
      borderColor: theme.accentBorder,
    },
    linkContent: {
      flex: 1,
      paddingTop: 2,
    },
    linkTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 2,
      letterSpacing: 0.2,
    },
    linkSubtitle: {
      fontSize: 13,
      color: theme.textSecondary,
      fontWeight: '500',
      letterSpacing: 0.1,
    },
    linkArrow: {
      marginLeft: 8,
    },
    footer: {
      alignItems: 'center',
      paddingVertical: 32,
      paddingHorizontal: 20,
      marginTop: 20,
      backgroundColor: theme.surfaceSecondary,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    footerText: {
      fontSize: 12,
      color: theme.textTertiary,
      textAlign: 'center',
      lineHeight: 18,
      letterSpacing: 0.1,
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
            <Ionicons name="arrow-back" size={20} color={theme.primary} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>About</Text>
            <Text style={styles.headerSubtitle}>App Information</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* App Info Section */}
          <View style={styles.appInfoSection}>
            <Text style={styles.appName}>{APP_INFO.NAME}</Text>
            <Text style={styles.appVersion}>Version {APP_INFO.VERSION}</Text>
            <Text style={styles.appDescription}>
              Professional Australian tax calculator designed to help you estimate
              your tax return for the {APP_INFO.FINANCIAL_YEAR} financial year.
              Simple, secure, and private - all data stays on your device.
            </Text>
            <View style={styles.disclaimerBanner}>
              <Ionicons name="warning" size={16} color={theme.warning} />
              <Text style={styles.disclaimerText}>
                Not affiliated with ATO • Estimates only • Consult a tax agent for final advice
              </Text>
            </View>
          </View>

          {/* Legal Information Section */}
          <View style={styles.legalContainer}>
            <Text style={styles.sectionTitle}>Important Information</Text>
            {legalSections.map((section, index) => (
              <View key={index} style={styles.legalSection}>
                <Text style={styles.legalTitle}>{section.title}</Text>
                <View style={styles.legalContent}>
                  {section.content.map((paragraph, paragraphIndex) => (
                    <Text key={paragraphIndex} style={styles.legalParagraph}>
                      {paragraph}
                    </Text>
                  ))}
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
            {'\n'}Not affiliated with the Australian Taxation Office
            {'\n'}Use at your own discretion - consult a tax professional for advice
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default AboutScreen;
