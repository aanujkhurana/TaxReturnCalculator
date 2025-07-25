import { useState, useEffect, useCallback, memo, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Animated,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  Modal,
  Linking,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import SplashScreen from './screens/SplashScreen';
import AboutScreen from './screens/AboutScreen';
import { saveCalculation } from './services/storageService';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { calculateTax } from './services/taxCalculationService';
import { generateAndSharePDF } from './services/pdfService';
import { formatCurrency } from './utils/formatters';
import { HELP_TEXT } from './constants/helpText';
import InputField from './components/forms/InputField';
import HelpModal from './components/ui/HelpModal';

// Styles definition - now a function that takes theme
const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.surfaceSecondary,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
  },


  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  tabContent: {
    marginTop: 20,
    paddingBottom: 20, // Additional bottom padding for safe area
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  helpIcon: {
    marginLeft: 'auto',
    padding: 4,
  },
  helpIconWithData: {
    marginLeft: 'auto',
    padding: 4,
    backgroundColor: theme.primaryLight,
    borderRadius: 12,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.text,
    marginLeft: 8,
    letterSpacing: 0.2,
  },
  input: {
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: theme.text,
    elevation: 1,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  inputError: {
    borderColor: theme.error,
    borderWidth: 2,
    backgroundColor: theme.errorLight,
  },
  inputDisabled: {
    backgroundColor: theme.borderLight,
    borderColor: theme.border,
    color: theme.textSecondary,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    color: theme.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 8,
    fontWeight: '500',
  },
  jobIncomeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  flexInput: {
    flex: 1,
  },
  removeButton: {
    marginLeft: 12,
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.buttonBack,
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.buttonBackBorder,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 10,
    fontSize: 15,
    letterSpacing: 0.2,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    borderWidth: 1.5,
    borderColor: theme.border,
  },
  toggleButtonActive: {
    backgroundColor: theme.primaryLight,
    borderColor: theme.primary,
    shadowColor: theme.primary,
    shadowOpacity: 0.12,
  },
  toggleText: {
    fontSize: 16,
    color: theme.textSecondary,
    marginLeft: 14,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  toggleTextActive: {
    color: theme.text,
    fontWeight: '600',
  },
  toggleSubtext: {
    fontSize: 13,
    color: theme.textTertiary,
    marginLeft: 38,
    marginTop: 4,
    lineHeight: 18,
  },
  wfhInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surfaceSecondary,
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  infoText: {
    fontSize: 12,
    color: theme.textLight,
    marginLeft: 6,
    flex: 1,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.primaryLight,
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: theme.primary,
  },
  infoBoxText: {
    fontSize: 14,
    color: theme.text,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },

  // Warning card styles
  warningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.warningLight,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: theme.warning,
    borderWidth: 1,
    borderColor: theme.warning,
  },

  warningCardText: {
    fontSize: 14,
    color: theme.text,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },

  // Professional loading styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  loadingCard: {
    backgroundColor: theme.surface,
    borderRadius: 24,
    padding: 36,
    alignItems: 'center',
    elevation: 10,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    minWidth: 300,
    maxWidth: 340,
    borderWidth: 1,
    borderColor: theme.border,
  },
  loadingIconContainer: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 50,
    backgroundColor: theme.primaryLight,
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  loadingSubtitle: {
    fontSize: 15,
    color: theme.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  loadingProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  loadingSpinner: {
    marginRight: 12,
  },
  loadingProgressText: {
    fontSize: 14,
    color: theme.primary,
    fontWeight: '500',
  },
  loadingSteps: {
    alignSelf: 'stretch',
    marginTop: 8,
  },
  loadingStep: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  loadingStepIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.primaryLight,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingStepIconActive: {
    backgroundColor: theme.primary,
  },
  loadingStepText: {
    fontSize: 13,
    color: theme.textSecondary,
    flex: 1,
  },
  loadingStepTextActive: {
    color: theme.text,
    fontWeight: '500',
  },
  loadingFooter: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.borderLight,
    alignSelf: 'stretch',
  },
  loadingFooterText: {
    fontSize: 12,
    color: theme.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
  },

  // Success banner styles
  successBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    elevation: 10,
  },
  successBannerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },

  resultContainer: {
    marginTop: 24,
    marginBottom: 40,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.surface,
  },
  resultHeader: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  resultSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  resultContent: {
    backgroundColor: theme.surface,
    padding: 20,
  },
  summaryCards: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: theme.surface,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 100,
  },
  summaryLabel: {
    fontSize: 13,
    color: theme.textSecondary,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  summaryAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.text,
    textAlign: 'center',
    letterSpacing: 0.3,
    lineHeight: 26,
  },
  breakdownSection: {
    marginBottom: 24,
    backgroundColor: theme.surfaceSecondary,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  breakdownTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    letterSpacing: 0.3,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    marginBottom: 2,
  },
  breakdownLabel: {
    fontSize: 15,
    color: theme.textSecondary,
    flex: 1,
    letterSpacing: 0.2,
  },
  breakdownValue: {
    fontSize: 15,
    color: theme.text,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  boldText: {
    fontWeight: 'bold',
    color: theme.text,
  },
  totalTaxItem: {
    borderTopWidth: 1,
    borderTopColor: theme.borderLight,
    marginTop: 8,
    paddingTop: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
    flexWrap: 'wrap',
  },
  actionButton: {
    flex: 1,
    minWidth: 140,
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 48,
  },
  pdfButton: {
    backgroundColor: '#dc3545',
  },
  saveButton: {
    backgroundColor: '#10B981',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 10,
    letterSpacing: 0.2,
  },
  // Step indicator styles - Compact and contemporary design
  stepIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  stepBackButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  stepIndicator: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: theme.borderLight,
  },
  stepIndicatorRow: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.surfaceSecondary,
    borderWidth: 1.5,
    borderColor: theme.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  stepCircleActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  stepCircleCurrent: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
    transform: [{ scale: 1.1 }],
  },
  stepCircleDisabled: {
    backgroundColor: theme.surfaceSecondary,
    borderColor: theme.borderLight,
    opacity: 0.6,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.textSecondary,
  },
  stepNumberActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  stepNumberDisabled: {
    color: theme.textTertiary,
  },
  stepLabel: {
    fontSize: 11,
    color: theme.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  stepLabelActive: {
    color: theme.text,
    fontWeight: '600',
  },
  stepLabelDisabled: {
    color: theme.textTertiary,
    opacity: 0.7,
  },
  stepLine: {
    position: 'absolute',
    top: 14,
    left: '60%',
    right: '-40%',
    height: 1.5,
    backgroundColor: theme.borderLight,
    zIndex: -1,
  },
  stepLineActive: {
    backgroundColor: theme.primary,
  },


  navButtonSpacer: {
    flex: 1,
  },
  // Step button styles
  stepButtonContainer: {
    marginTop: 32,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  stepButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    minHeight: 56,
  },
  stepButtonNext: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: theme.primaryBorder,
  },
  stepButtonNextGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 56,
  },
  stepButtonNextIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginRight: 12,
  },
  stepButtonCalculate: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: theme.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: theme.accentBorder,
  },
  stepButtonCalculateGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 56,
  },
  stepButtonCalculateIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginRight: 12,
  },
  stepButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginRight: 8,
  },
  stepButtonNextText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  readyToCalculateLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  readyToCalculateLabelText: {
    fontSize: 14,
    color: theme.textSecondary,
    fontWeight: '500',
    marginLeft: 8,
    letterSpacing: 0.2,
  },
  startOverButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: theme.surfaceSecondary,
    borderWidth: 1.5,
    borderColor: theme.primary,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    height: 48,
  },
  startOverButtonText: {
    fontSize: 16,
    color: theme.primary,
    fontWeight: '600',
    marginLeft: 10,
    letterSpacing: 0.2,
  },
  navigationButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  homeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: theme.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    height: 48,
  },
  homeButtonText: {
    fontSize: 16,
    color: theme.primary,
    fontWeight: '600',
    marginLeft: 10,
    letterSpacing: 0.2,
  },
  fullRowButtonsContainer: {
    marginTop: 20,
    gap: 12,
  },
  fullRowHomeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: theme.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.primary,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    width: '100%',
    height: 56,
  },
  fullRowEditButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: theme.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    width: '100%',
    height: 56,
  },
  fullRowButtonText: {
    fontSize: 16,
    color: theme.primary,
    fontWeight: '600',
    marginLeft: 10,
    letterSpacing: 0.2,
  },
  // Help Modal Styles
  helpModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  helpModalContent: {
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
  helpModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  helpModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.text,
    flex: 1,
  },
  helpModalCloseButton: {
    padding: 4,
  },
  helpModalScrollView: {
    maxHeight: 400,
  },
  helpSection: {
    marginBottom: 16,
  },
  helpSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  helpSectionText: {
    fontSize: 15,
    color: theme.textSecondary,
    lineHeight: 22,
    marginBottom: 8,
  },
  helpExamplesList: {
    marginLeft: 12,
  },
  helpExampleItem: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 4,
    lineHeight: 20,
  },
  helpTipsList: {
    marginLeft: 12,
  },
  helpTipItem: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 6,
    lineHeight: 20,
  },
  helpWhereToFind: {
    backgroundColor: theme.primaryLight,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: theme.primary,
  },
  helpWhereToFindText: {
    fontSize: 14,
    color: theme.text,
    fontStyle: 'italic',
    lineHeight: 20,
  },

  // Deduction category styles
  deductionCategory: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 0,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },

  categoryTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 6,
    letterSpacing: 0.2,
    lineHeight: 24,
  },

  categoryDescription: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 0,
    lineHeight: 20,
    letterSpacing: 0.1,
  },

  // Enhanced collapsible category styles with better visual hierarchy
  deductionCategoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: theme.surfaceSecondary,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  deductionCategoryHeaderCollapsed: {
    borderBottomWidth: 0,
    borderRadius: 12,
    marginBottom: 8,
  },

  categoryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  categoryIconActive: {
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  categoryTitleContainer: {
    flex: 1,
  },

  categoryToggle: {
    padding: 10,
    borderRadius: 22,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  categoryContent: {
    padding: 24,
    paddingTop: 20,
    backgroundColor: theme.surface,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: theme.border,
  },

  categoryTotal: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.text,
    marginTop: 6,
    letterSpacing: 0.3,
  },

  // Enhanced deduction summary styles
  deductionSummary: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.primary,
    marginLeft: 8,
    flex: 1,
  },

  summaryBadge: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  summaryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },

  summaryAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.text,
    textAlign: 'center',
    marginBottom: 16,
  },

  summaryBreakdown: {
    marginBottom: 16,
  },

  summaryBreakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  summaryBreakdownDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },

  summaryBreakdownLabel: {
    fontSize: 14,
    color: theme.textSecondary,
    flex: 1,
  },

  summaryBreakdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
  },

  taxSavingsEstimate: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.successLight,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.success,
  },

  taxSavingsText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.success,
    marginLeft: 6,
  },

  // Quick summary bar styles
  quickSummaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.primaryLight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.primaryBorder,
  },

  quickSummaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  quickSummaryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.textSecondary,
    marginRight: 8,
  },

  quickSummaryAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.text,
  },

  quickSummaryRight: {
    alignItems: 'flex-end',
  },

  quickSummaryTax: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.success,
  },

  // Progress indicator styles
  progressContainer: {
    marginBottom: 16,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textSecondary,
  },

  progressText: {
    fontSize: 12,
    color: theme.textSecondary,
  },

  progressBar: {
    height: 6,
    backgroundColor: theme.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: theme.primary,
    borderRadius: 3,
  },

  // Smart input feature styles
  inputFocused: {
    borderColor: theme.primary,
    borderWidth: 2,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  inputWithValue: {
    backgroundColor: theme.surfaceSecondary,
    borderColor: theme.primaryBorder,
  },

  suggestionsContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: theme.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
  },

  suggestionsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.textSecondary,
    marginBottom: 8,
  },

  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  suggestionChip: {
    backgroundColor: theme.primary,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 4,
  },

  suggestionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  validationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  validationText: {
    fontSize: 12,
    color: theme.success,
    marginLeft: 4,
    fontWeight: '500',
  },

  // Quick Add Progressive Disclosure styles
  quickAddContainer: {
    backgroundColor: theme.surfaceSecondary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.border,
  },

  quickAddTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 4,
  },

  quickAddSubtitle: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 16,
  },

  quickAddGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },

  quickAddButton: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    minHeight: 100,
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },

  quickAddButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
    marginTop: 8,
    textAlign: 'center',
  },

  quickAddButtonAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.text,
    marginTop: 4,
  },

  // Show All Categories styles
  showAllContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },

  showAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surfaceSecondary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: theme.border,
  },

  showAllButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
    marginLeft: 6,
  },

  // Completion indicators styles
  completionStatus: {
    marginTop: 16,
    padding: 12,
    backgroundColor: theme.successLight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.success,
  },

  completionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  completionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
    marginLeft: 6,
  },

  completionText: {
    fontSize: 13,
    color: '#047857',
    lineHeight: 18,
  },

  // Tips guidance styles
  nextStepsContainer: {
    backgroundColor: theme.primaryLight,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.primaryBorder,
  },

  nextStepsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  nextStepsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.text,
    marginLeft: 8,
  },

  nextStepsList: {
    gap: 12,
  },

  nextStepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  nextStepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },

  nextStepNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },

  nextStepText: {
    fontSize: 14,
    color: theme.text,
    lineHeight: 20,
    flex: 1,
  },

  // Enhanced Results Screen styles
  resultMainCard: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 24,
    marginTop: 16,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  resultMainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  resultMainLabel: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 12,
  },

  resultMainAmount: {
    fontSize: 36,
    fontWeight: '800',
    textAlign: 'center',
    marginVertical: 8,
  },

  resultMainSubtext: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },

  resultMainFinancialYear: {
    fontSize: 12,
    color: theme.textTertiary,
    textAlign: 'center',
    fontWeight: '400',
    marginTop: 2,
  },

  // Results header styles
  resultsHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  tableViewButton: {
    backgroundColor: theme.surface,
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },



  // Full width home button styles
  fullWidthHomeButton: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginBottom: Platform.OS === 'ios' ? 50 : 40, // Platform-specific bottom margin for nav bar
    borderWidth: 2,
    borderColor: theme.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  fullWidthHomeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.primary,
    marginLeft: 8,
  },

  // ATO Integration Button Styles
  atoFileReturnButton: {
    backgroundColor: '#1E40AF', // ATO blue color
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#1D4ED8',
  },

  atoFileReturnButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 10,
    marginRight: 4,
  },

  atoFileReturnDescription: {
    fontSize: 14,
    color: theme.text, // Use theme text color (white/black based on theme)
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 6,
    marginHorizontal: 16,
    fontWeight: '500',
    letterSpacing: 0.1,
    lineHeight: 20,
  },

  externalLinkIcon: {
    marginLeft: 6,
  },

  // Table view styles
  tableContainer: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  tableHeader: {
    backgroundColor: theme.surfaceSecondary,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },

  tableHeaderText: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.text,
    textAlign: 'center',
  },

  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
    alignItems: 'center',
    minHeight: 50,
  },

  tableRowLast: {
    borderBottomWidth: 0,
  },

  tableRowHeader: {
    backgroundColor: theme.surfaceSecondary,
    borderBottomWidth: 2,
    borderBottomColor: theme.border,
  },

  tableCell: {
    flex: 1,
    paddingRight: 12,
  },

  tableCellType: {
    flex: 2,
    minWidth: 120,
  },

  tableCellValue: {
    flex: 1,
    alignItems: 'flex-end',
    minWidth: 80,
  },

  tableCellDescription: {
    flex: 2,
    minWidth: 150,
  },

  tableCellText: {
    fontSize: 14,
    color: theme.textSecondary,
    fontWeight: '500',
  },

  tableCellHeaderText: {
    fontSize: 14,
    color: theme.text,
    fontWeight: '700',
  },

  tableCellValueText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },

  tableCellDescriptionText: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    flexWrap: 'wrap',
  },

  tableSection: {
    marginBottom: 0,
  },

  tableSectionHeader: {
    backgroundColor: theme.surfaceSecondary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },

  tableSectionHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.text,
  },

  // Compact table styles
  compactTableContainer: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },

  compactTableContent: {
    width: '100%', // Fixed width instead of minWidth
  },

  compactTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.borderLight,
    minHeight: 48,
  },

  compactTableHeaderRow: {
    backgroundColor: theme.surfaceSecondary,
    borderBottomWidth: 2,
    borderBottomColor: theme.border,
  },

  compactTableFinalRow: {
    backgroundColor: theme.successLight,
    borderBottomWidth: 0,
  },

  compactTableCell: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },

  compactTableCellLabel: {
    flex: 2,
    borderRightWidth: 1,
    borderRightColor: theme.borderLight,
  },

  compactTableCellValue: {
    flex: 1,
    alignItems: 'flex-end',
  },

  compactTableCellText: {
    fontSize: 14,
    color: theme.textSecondary, // Use theme color instead of hardcoded
    fontWeight: '500',
  },

  compactTableHeaderText: {
    fontWeight: '700',
    color: theme.text, // Use theme color instead of hardcoded
  },

  compactTableFinalText: {
    fontWeight: '700',
    color: theme.success, // Use theme color instead of hardcoded
  },

  compactTableValueText: {
    fontWeight: '600',
    textAlign: 'right',
    color: theme.text, // Use theme color for values
  },
});

// HelpModal component will be defined inside AppContent function

// InputField component will be defined inside AppContent function

// Help text has been moved to constants/helpText.js





// InputField component is now imported from components/forms/InputField.js





// HelpModal component is now imported from components/ui/HelpModal.js

function AppContent() {
  // Theme hook
  const { theme, isDark, isLoading: themeLoading } = useTheme();
  const styles = getStyles(theme);

  // ScrollView ref for scroll to top functionality
  const scrollViewRef = useRef(null);

  // Show splash screen while theme is loading or during initial splash
  const [showSplash, setShowSplash] = useState(true);

  // Navigation state
  const [currentScreen, setCurrentScreen] = useState('splash'); // 'splash', 'home', 'about', or 'calculator'
  const [viewingCalculation, setViewingCalculation] = useState(null);

  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Form data
  const [jobIncomes, setJobIncomes] = useState(['']);
  const [taxWithheld, setTaxWithheld] = useState('');
  const [deductions, setDeductions] = useState({
    workRelated: {
      travel: '',
      equipment: '',
      uniforms: '',
      memberships: '',
      other: ''
    },
    selfEducation: {
      courseFees: '',
      textbooks: '',
      conferences: '',
      certifications: '',
      other: ''
    },
    donations: {
      charitable: '',
      disasterRelief: '',
      religious: '',
      other: ''
    },
    other: {
      investment: '',
      taxAgent: '',
      incomeProtection: '',
      bankFees: '',
      other: ''
    }
  });
  const [workFromHomeHours, setWorkFromHomeHours] = useState('');
  const [abnIncome, setAbnIncome] = useState('');
  const [hecsDebt, setHecsDebt] = useState(false);
  const [medicareExemption, setMedicareExemption] = useState(false);
  const [dependents, setDependents] = useState('0');
  const [hasDependents, setHasDependents] = useState(false);

  // PAYG estimation feature
  const [paygUnknown, setPaygUnknown] = useState(false);
  const [estimatedPayg, setEstimatedPayg] = useState('');
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [resultsViewMode, setResultsViewMode] = useState('card'); // 'card' or 'table'

  // Form validation errors
  const [validationErrors, setValidationErrors] = useState({});

  // Deduction category collapse state
  const [collapsedCategories, setCollapsedCategories] = useState({
    workRelated: false,
    selfEducation: true,
    donations: true,
    other: true,
    workFromHome: true
  });

  // Income category collapse state - all expanded by default
  const [incomeCollapsedCategories, setIncomeCollapsedCategories] = useState({
    employment: false,
    abn: false,
    payg: false
  });

  // Details category collapse state
  const [detailsCollapsedCategories, setDetailsCollapsedCategories] = useState({
    hecsDebt: false,
    medicareLevy: false,
    disclaimer: true
  });

  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);
  const loadingPulseAnim = new Animated.Value(1);
  const headerScaleAnim = new Animated.Value(0.95);
  const headerOpacityAnim = new Animated.Value(0);

  // Navigation functions
  const handleSplashFinish = () => {
    setShowSplash(false);
    setCurrentScreen('home');
  };

  const navigateToCalculator = () => {
    setCurrentScreen('calculator');
    resetForm();
  };

  const navigateToHome = () => {
    setCurrentScreen('home');
    setViewingCalculation(null);
  };

  const navigateToAbout = () => {
    setCurrentScreen('about');
  };

  const handleNavigation = (screen) => {
    switch (screen) {
      case 'home':
        navigateToHome();
        break;
      case 'about':
        navigateToAbout();
        break;
      default:
        navigateToHome();
        break;
    }
  };

  // Function to handle opening external URLs
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

  const viewCalculation = async (calculation) => {
    setViewingCalculation(calculation);
    // Load the calculation data into the form
    setJobIncomes(calculation.formData.jobIncomes || ['']);
    setTaxWithheld(calculation.formData.taxWithheld || '');
    setDeductions(calculation.formData.deductions || {
      workRelated: {
        travel: '',
        equipment: '',
        uniforms: '',
        memberships: '',
        other: ''
      },
      selfEducation: {
        courseFees: '',
        textbooks: '',
        conferences: '',
        certifications: '',
        other: ''
      },
      donations: {
        charitable: '',
        disasterRelief: '',
        religious: '',
        other: ''
      },
      other: {
        investment: '',
        taxAgent: '',
        incomeProtection: '',
        bankFees: '',
        other: ''
      }
    });
    setWorkFromHomeHours(calculation.formData.workFromHomeHours || '');
    setAbnIncome(calculation.formData.abnIncome || '');
    setHecsDebt(calculation.formData.hecsDebt || false);
    setMedicareExemption(calculation.formData.medicareExemption || false);
    setDependents(calculation.formData.dependents || '0');
    setHasDependents(calculation.formData.hasDependents || false);
    setResult(calculation.result);
    setCurrentStep(4); // Go directly to results
    setCurrentScreen('calculator');
    // Scroll to top when viewing calculation results
    setTimeout(() => scrollToTop(), 100);
  };

  const resetForm = () => {
    setCurrentStep(1);
    setJobIncomes(['']);
    setTaxWithheld('');
    setDeductions({
      workRelated: {
        travel: '',
        equipment: '',
        uniforms: '',
        memberships: '',
        other: ''
      },
      selfEducation: {
        courseFees: '',
        textbooks: '',
        conferences: '',
        certifications: '',
        other: ''
      },
      donations: {
        charitable: '',
        disasterRelief: '',
        religious: '',
        other: ''
      },
      other: {
        investment: '',
        taxAgent: '',
        incomeProtection: '',
        bankFees: '',
        other: ''
      }
    });
    setWorkFromHomeHours('');
    setAbnIncome('');
    setHecsDebt(false);
    setMedicareExemption(false);
    setDependents('0');
    setHasDependents(false);
    setResult(null);
    setValidationErrors({});
    setPaygUnknown(false);
    setEstimatedPayg('');
  };

  const handleSaveCalculation = async () => {
    if (!result) {
      Alert.alert('Error', 'No calculation to save');
      return;
    }

    Alert.prompt(
      'Save Calculation',
      'Enter a name for this calculation (optional):',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Save',
          onPress: async (name) => {
            try {
              const calculationData = {
                jobIncomes,
                taxWithheld,
                deductions,
                workFromHomeHours,
                abnIncome,
                hecsDebt,
                medicareExemption,
                dependents,
                hasDependents,
                result,
              };

              await saveCalculation(calculationData, name);
              Alert.alert(
                'Success',
                'Calculation saved successfully!',
                [
                  {
                    text: 'OK',
                    onPress: () => navigateToHome(),
                  },
                ]
              );
            } catch (error) {
              console.error('Error saving calculation:', error);
              Alert.alert('Error', 'Failed to save calculation');
            }
          },
        },
      ],
      'plain-text'
    );
  };

  // Helper functions for validation errors
  const setFieldError = (fieldName, errorMessage) => {
    setValidationErrors(prev => ({
      ...prev,
      [fieldName]: errorMessage
    }));
  };

  const clearFieldError = (fieldName) => {
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const clearAllErrors = () => {
    setValidationErrors({});
  };

  // Calculate estimated PAYG withholding based on TFN income only
  const calculateEstimatedPayg = useCallback(() => {
    const parsedJobIncomes = jobIncomes.map((val) => parseFloat(val || '0'));
    const totalTFNIncome = parsedJobIncomes.reduce((sum, curr) => sum + (isNaN(curr) ? 0 : curr), 0);
    // Note: ABN income is excluded as PAYG tax is not withheld from ABN/business income

    if (totalTFNIncome <= 0) {
      return '0';
    }

    // Use the same calculation method as estimateTaxWithheld for consistency
    // Australian tax brackets 2024-25
    let estimatedWithholding = 0;
    if (totalTFNIncome > 18200) {
      if (totalTFNIncome <= 45000) {
        estimatedWithholding = (totalTFNIncome - 18200) * 0.19;
      } else if (totalTFNIncome <= 120000) {
        estimatedWithholding = (45000 - 18200) * 0.19 + (totalTFNIncome - 45000) * 0.325;
      } else if (totalTFNIncome <= 180000) {
        estimatedWithholding = (45000 - 18200) * 0.19 + (120000 - 45000) * 0.325 + (totalTFNIncome - 120000) * 0.37;
      } else {
        estimatedWithholding = (45000 - 18200) * 0.19 + (120000 - 45000) * 0.325 + (180000 - 120000) * 0.37 + (totalTFNIncome - 180000) * 0.45;
      }
    }

    // Add Medicare levy (2% of TFN income only)
    if (totalTFNIncome > 23226) { // Use same threshold as estimateTaxWithheld
      estimatedWithholding += totalTFNIncome * 0.02;
    }

    return Math.round(estimatedWithholding).toString();
  }, [jobIncomes]);

  // Handle PAYG unknown checkbox toggle
  const handlePaygUnknownToggle = useCallback(() => {
    const newPaygUnknown = !paygUnknown;
    setPaygUnknown(newPaygUnknown);

    if (newPaygUnknown) {
      // When enabling estimation, calculate and set estimated value
      const estimated = calculateEstimatedPayg();
      setEstimatedPayg(estimated);
      setTaxWithheld(estimated);
    } else {
      // When disabling estimation, clear the field for manual entry
      setTaxWithheld('');
      setEstimatedPayg('');
    }

    // Clear any validation errors
    clearFieldError('taxWithheld');
  }, [paygUnknown, calculateEstimatedPayg, clearFieldError]);

  // Update estimated PAYG when TFN income values change and estimation is enabled
  // Note: ABN income changes don't affect PAYG estimation as no tax is withheld from ABN income
  useEffect(() => {
    if (paygUnknown) {
      const estimated = calculateEstimatedPayg();
      setEstimatedPayg(estimated);
      setTaxWithheld(estimated);
    }
  }, [paygUnknown, jobIncomes, calculateEstimatedPayg]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(headerOpacityAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(headerScaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  // Loading pulse animation
  useEffect(() => {
    if (isCalculating) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(loadingPulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(loadingPulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          })
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    } else {
      loadingPulseAnim.setValue(1);
    }
  }, [isCalculating, loadingPulseAnim]);

  // Auto-calculate when reaching step 4 if no result exists
  useEffect(() => {
    if (currentStep === 4 && !result) {
      estimateTax();
    }
  }, [currentStep, result, estimateTax]);

  const updateJobIncome = useCallback((index, value) => {
    setJobIncomes(prevIncomes => {
      const newIncomes = [...prevIncomes];
      newIncomes[index] = value;

      // Auto-fill tax withheld based on TFN employment income only
      const totalEmploymentIncome = newIncomes.reduce((sum, income) => sum + parseFloat(income || '0'), 0);
      // Note: ABN income excluded as PAYG tax is not withheld from ABN/business income

      // Auto-fill tax withheld if not manually set and not unknown
      if (!paygUnknown && totalEmploymentIncome > 0) {
        const estimatedTax = estimateTaxWithheld(totalEmploymentIncome);
        setTaxWithheld(estimatedTax.toString());
      }

      return newIncomes;
    });
    // Clear error for this field when user starts typing
    clearFieldError(`jobIncome_${index}`);
  }, [paygUnknown, estimateTaxWithheld]);

  const addJobIncomeField = useCallback(() => {
    setJobIncomes(prevIncomes => [...prevIncomes, '']);
  }, []);

  const removeJobIncomeField = useCallback((index) => {
    setJobIncomes(prevIncomes => {
      if (prevIncomes.length > 1) {
        return prevIncomes.filter((_, i) => i !== index);
      }
      return prevIncomes;
    });
  }, []);

  // Memoized deduction update functions for subcategories
  const updateDeductionField = useCallback((category, field, value) => {
    setDeductions(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  }, []);

  // Work-related deduction update functions
  const updateWorkRelatedTravel = useCallback((value) => updateDeductionField('workRelated', 'travel', value), [updateDeductionField]);
  const updateWorkRelatedEquipment = useCallback((value) => updateDeductionField('workRelated', 'equipment', value), [updateDeductionField]);
  const updateWorkRelatedUniforms = useCallback((value) => updateDeductionField('workRelated', 'uniforms', value), [updateDeductionField]);
  const updateWorkRelatedMemberships = useCallback((value) => updateDeductionField('workRelated', 'memberships', value), [updateDeductionField]);
  const updateWorkRelatedOther = useCallback((value) => updateDeductionField('workRelated', 'other', value), [updateDeductionField]);

  // Self-education deduction update functions
  const updateSelfEducationCourseFees = useCallback((value) => updateDeductionField('selfEducation', 'courseFees', value), [updateDeductionField]);
  const updateSelfEducationTextbooks = useCallback((value) => updateDeductionField('selfEducation', 'textbooks', value), [updateDeductionField]);
  const updateSelfEducationConferences = useCallback((value) => updateDeductionField('selfEducation', 'conferences', value), [updateDeductionField]);
  const updateSelfEducationCertifications = useCallback((value) => updateDeductionField('selfEducation', 'certifications', value), [updateDeductionField]);
  const updateSelfEducationOther = useCallback((value) => updateDeductionField('selfEducation', 'other', value), [updateDeductionField]);

  // Donations deduction update functions
  const updateDonationsCharitable = useCallback((value) => updateDeductionField('donations', 'charitable', value), [updateDeductionField]);
  const updateDonationsDisasterRelief = useCallback((value) => updateDeductionField('donations', 'disasterRelief', value), [updateDeductionField]);
  const updateDonationsReligious = useCallback((value) => updateDeductionField('donations', 'religious', value), [updateDeductionField]);
  const updateDonationsOther = useCallback((value) => updateDeductionField('donations', 'other', value), [updateDeductionField]);

  // Other deduction update functions
  const updateOtherInvestment = useCallback((value) => updateDeductionField('other', 'investment', value), [updateDeductionField]);
  const updateOtherTaxAgent = useCallback((value) => updateDeductionField('other', 'taxAgent', value), [updateDeductionField]);
  const updateOtherIncomeProtection = useCallback((value) => updateDeductionField('other', 'incomeProtection', value), [updateDeductionField]);
  const updateOtherBankFees = useCallback((value) => updateDeductionField('other', 'bankFees', value), [updateDeductionField]);
  const updateOtherOther = useCallback((value) => updateDeductionField('other', 'other', value), [updateDeductionField]);

  // Create stable callback references for job income updates
  const jobIncomeCallbacks = useMemo(() => {
    return jobIncomes.map((_, index) => (value) => updateJobIncome(index, value));
  }, [jobIncomes.length, updateJobIncome]);

  const formatCurrency = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? '$0.00' : `$${num.toLocaleString('en-AU', { minimumFractionDigits: 2 })}`;
  };

  // Helper function to scroll to top
  const scrollToTop = useCallback(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  }, []);

  // Step navigation functions
  const nextStep = useCallback(() => {
    console.log('Next step clicked. Current values:', { jobIncomes, abnIncome, taxWithheld });
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      // Scroll to top when moving to next step
      setTimeout(() => scrollToTop(), 100);
    }
  }, [totalSteps, validateCurrentStep, jobIncomes, abnIncome, taxWithheld, scrollToTop]);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    // Scroll to top when moving to previous step
    setTimeout(() => scrollToTop(), 100);
  }, [scrollToTop]);

  // Back button navigation function
  const handleBackNavigation = useCallback(() => {
    if (currentStep === 1 || currentStep === 4) {
      // From step 1 (page 1) or step 4 (success) go to home
      navigateToHome();
    } else {
      // From step 2 (page 2) go to step 1 (page 1)
      // From step 3 (page 3) go to step 2 (page 2)
      setCurrentStep(prev => Math.max(prev - 1, 1));
      // Scroll to top when navigating back
      setTimeout(() => scrollToTop(), 100);
    }
  }, [currentStep, scrollToTop]);

  const goToStep = (step) => {
    // Prevent direct access to results step unless calculation is complete
    if (step === 4 && !result) {
      Alert.alert('Complete Form First', 'Please complete the form and calculate your tax estimate before viewing results.');
      return;
    }

    // For steps 2 and 3, validate step 1 first
    if (step > 1) {
      // Validate step 1 income data
      clearAllErrors();
      let hasErrors = false;

      // Check if at least one income source has a valid positive value
      const hasValidJobIncome = jobIncomes.some(income => {
        const trimmed = income?.trim();
        const parsed = parseFloat(trimmed);
        return trimmed && !isNaN(parsed) && parsed > 0;
      });

      const hasValidAbnIncome = abnIncome?.trim() && !isNaN(parseFloat(abnIncome.trim())) && parseFloat(abnIncome.trim()) > 0;

      // Validate individual job income fields
      jobIncomes.forEach((income, index) => {
        const trimmed = income?.trim();
        const parsed = parseFloat(trimmed);
        if (trimmed && (isNaN(parsed) || parsed <= 0)) {
          setFieldError(`jobIncome_${index}`, 'Must be a valid number greater than 0');
          hasErrors = true;
        }
      });

      // Validate ABN income if provided
      if (abnIncome?.trim()) {
        const parsed = parseFloat(abnIncome.trim());
        if (isNaN(parsed) || parsed <= 0) {
          setFieldError('abnIncome', 'Must be a valid number greater than 0');
          hasErrors = true;
        }
      }

      // Check if at least one income source is valid
      if (!hasValidJobIncome && !hasValidAbnIncome) {
        if (!jobIncomes.some(income => income?.trim())) {
          setFieldError('jobIncome_0', 'At least one income source is required');
        }
        if (!abnIncome?.trim()) {
          setFieldError('abnIncome', 'Enter ABN income or at least one job income');
        }
        hasErrors = true;
      }

      // Check tax withheld
      const taxWithheldTrimmed = taxWithheld?.trim();
      const taxWithheldParsed = parseFloat(taxWithheldTrimmed);

      if (!taxWithheldTrimmed) {
        setFieldError('taxWithheld', 'Tax withheld is required');
        hasErrors = true;
      } else if (isNaN(taxWithheldParsed) || taxWithheldParsed < 0) {
        setFieldError('taxWithheld', 'Must be a valid number (0 or greater)');
        hasErrors = true;
      }

      if (hasErrors) {
        // Stay on step 1 to show validation errors
        setCurrentStep(1);
        return;
      }
    }

    setCurrentStep(step);
    // Scroll to top when navigating to a step
    setTimeout(() => scrollToTop(), 100);
  };

  // Step validation
  const validateCurrentStep = useCallback(() => {
    clearAllErrors(); // Clear previous errors

    switch (currentStep) {
      case 1: // Income step
        let hasErrors = false;

        // Check if at least one income source has a valid positive value
        const hasValidJobIncome = jobIncomes.some(income => {
          const trimmed = income?.trim();
          const parsed = parseFloat(trimmed);
          return trimmed && !isNaN(parsed) && parsed > 0;
        });

        const hasValidAbnIncome = abnIncome?.trim() && !isNaN(parseFloat(abnIncome.trim())) && parseFloat(abnIncome.trim()) > 0;

        // Validate individual job income fields
        jobIncomes.forEach((income, index) => {
          const trimmed = income?.trim();
          const parsed = parseFloat(trimmed);
          if (trimmed && (isNaN(parsed) || parsed <= 0)) {
            setFieldError(`jobIncome_${index}`, 'Must be a valid number greater than 0');
            hasErrors = true;
          }
        });

        // Validate ABN income if provided
        if (abnIncome?.trim()) {
          const parsed = parseFloat(abnIncome.trim());
          if (isNaN(parsed) || parsed <= 0) {
            setFieldError('abnIncome', 'Must be a valid number greater than 0');
            hasErrors = true;
          }
        }

        // Check if at least one income source is valid
        if (!hasValidJobIncome && !hasValidAbnIncome) {
          if (!jobIncomes.some(income => income?.trim())) {
            setFieldError('jobIncome_0', 'At least one income source is required');
          }
          if (!abnIncome?.trim()) {
            setFieldError('abnIncome', 'Enter ABN income or at least one job income');
          }
          hasErrors = true;
        }

        // Check tax withheld
        const taxWithheldTrimmed = taxWithheld?.trim();
        const taxWithheldParsed = parseFloat(taxWithheldTrimmed);

        if (paygUnknown) {
          // If PAYG is estimated, ensure we have a valid estimated value
          if (!taxWithheldTrimmed || isNaN(taxWithheldParsed) || taxWithheldParsed < 0) {
            // Recalculate estimation if needed
            const estimated = calculateEstimatedPayg();
            setEstimatedPayg(estimated);
            setTaxWithheld(estimated);
          }
        } else {
          // Manual entry validation
          if (!taxWithheldTrimmed) {
            setFieldError('taxWithheld', 'Tax withheld is required');
            hasErrors = true;
          } else if (isNaN(taxWithheldParsed) || taxWithheldParsed < 0) {
            setFieldError('taxWithheld', 'Must be a valid number (0 or greater)');
            hasErrors = true;
          }
        }

        return !hasErrors;
      case 2: // Deductions step - optional, always valid
        return true;
      case 3: // Details step - optional, always valid
        return true;
      case 4: // Results step
        return true;
      default:
        return true;
    }
  }, [currentStep, jobIncomes, abnIncome, taxWithheld, paygUnknown, calculateEstimatedPayg, setEstimatedPayg, setTaxWithheld]);

  const validateInputs = () => {
    clearAllErrors(); // Clear previous errors
    let hasErrors = false;

    // Check tax withheld
    const taxWithheldTrimmed = taxWithheld?.trim();
    if (!taxWithheldTrimmed) {
      setFieldError('taxWithheld', 'Tax withheld is required');
      hasErrors = true;
    } else if (isNaN(parseFloat(taxWithheldTrimmed)) || parseFloat(taxWithheldTrimmed) < 0) {
      setFieldError('taxWithheld', 'Must be a valid number (0 or greater)');
      hasErrors = true;
    }

    // Check if at least one income source has a valid positive value
    const hasValidJobIncome = jobIncomes.some(income => {
      const trimmed = income?.trim();
      const parsed = parseFloat(trimmed);
      return trimmed && !isNaN(parsed) && parsed > 0;
    });

    const hasValidAbnIncome = abnIncome?.trim() && !isNaN(parseFloat(abnIncome.trim())) && parseFloat(abnIncome.trim()) > 0;

    // Validate individual job income fields
    jobIncomes.forEach((income, index) => {
      const trimmed = income?.trim();
      const parsed = parseFloat(trimmed);
      if (trimmed && (isNaN(parsed) || parsed <= 0)) {
        setFieldError(`jobIncome_${index}`, 'Must be a valid number greater than 0');
        hasErrors = true;
      }
    });

    // Validate ABN income if provided
    if (abnIncome?.trim()) {
      const parsed = parseFloat(abnIncome.trim());
      if (isNaN(parsed) || parsed <= 0) {
        setFieldError('abnIncome', 'Must be a valid number greater than 0');
        hasErrors = true;
      }
    }

    // Check if at least one income source is valid
    if (!hasValidJobIncome && !hasValidAbnIncome) {
      if (!jobIncomes.some(income => income?.trim())) {
        setFieldError('jobIncome_0', 'At least one income source is required');
      }
      if (!abnIncome?.trim()) {
        setFieldError('abnIncome', 'Enter ABN income or at least one job income');
      }
      hasErrors = true;
    }

    return !hasErrors;
  };

  const estimateTax = useCallback(() => {
    if (!validateInputs()) return;

    setIsCalculating(true);
    setLoadingStep(0);

    // Simulate professional loading steps with realistic timing
    const loadingSteps = [
      { step: 1, delay: 800, message: 'Validating income sources' },
      { step: 2, delay: 1200, message: 'Processing deductions' },
      { step: 3, delay: 1600, message: 'Applying tax brackets & offsets' },
      { step: 4, delay: 2000, message: 'Generating comprehensive report' }
    ];

    loadingSteps.forEach(({ step, delay }) => {
      setTimeout(() => {
        setLoadingStep(step);
      }, delay);
    });

    const parsedJobIncomes = jobIncomes.map((val) => parseFloat(val || '0'));
    const totalTFNIncome = parsedJobIncomes.reduce((sum, curr) => sum + (isNaN(curr) ? 0 : curr), 0);
    const abnIncomeNum = parseFloat(abnIncome || '0');
    const taxWithheldNum = parseFloat(taxWithheld || '0');
    const wfhHours = parseFloat(workFromHomeHours || '0');
    const dependentsNum = hasDependents ? parseInt(dependents || '0') : 0;

    // Calculate total deductions
    const workFromHomeDeduction = wfhHours * 0.67;

    // Calculate total manual deductions from nested structure
    const totalManualDeductions = Object.values(deductions).reduce((categorySum, category) => {
      if (typeof category === 'object' && category !== null) {
        // New nested structure
        return categorySum + Object.values(category).reduce((subSum, val) => {
          return subSum + (parseFloat(val || '0'));
        }, 0);
      } else {
        // Backward compatibility for old flat structure
        return categorySum + (parseFloat(category || '0'));
      }
    }, 0);

    const totalDeductions = totalManualDeductions + workFromHomeDeduction;

    const totalIncome = totalTFNIncome + abnIncomeNum;
    const taxableIncome = Math.max(0, totalIncome - totalDeductions);

    // 2024-25 tax brackets
    let tax = 0;
    if (taxableIncome > 180000) {
      tax = 51667 + (taxableIncome - 180000) * 0.45;
    } else if (taxableIncome > 120000) {
      tax = 29467 + (taxableIncome - 120000) * 0.37;
    } else if (taxableIncome > 45000) {
      tax = (45000 - 18200) * 0.19 + (taxableIncome - 45000) * 0.325;
    } else if (taxableIncome > 18200) {
      tax = (taxableIncome - 18200) * 0.19;
    }

    // Low Income Tax Offset (LITO) for 2024-25
    let lito = 0;
    if (taxableIncome <= 37500) {
      lito = 700;
    } else if (taxableIncome <= 45000) {
      lito = 700 - ((taxableIncome - 37500) * 0.05);
    } else if (taxableIncome <= 66667) {
      lito = 325 - ((taxableIncome - 45000) * 0.015);
    }

    // Medicare Levy
    const medicareThreshold = dependentsNum > 0 ? 45907 + (dependentsNum * 4216) : 27222;
    let medicare = 0;
    if (!medicareExemption && taxableIncome > medicareThreshold) {
      if (taxableIncome <= medicareThreshold * 1.1) {
        // Medicare levy reduction
        medicare = (taxableIncome * 0.02) * ((taxableIncome - medicareThreshold) / (medicareThreshold * 0.1));
      } else {
        medicare = taxableIncome * 0.02;
      }
    }

    // HECS-HELP repayment for 2024-25
    let hecsRepayment = 0;
    if (hecsDebt) {
      if (taxableIncome >= 51000) {
        const hecsThresholds = [
          { min: 51000, max: 59999, rate: 0.01 },
          { min: 60000, max: 67999, rate: 0.02 },
          { min: 68000, max: 71999, rate: 0.025 },
          { min: 72000, max: 78999, rate: 0.03 },
          { min: 79000, max: 88999, rate: 0.035 },
          { min: 89000, max: 97999, rate: 0.04 },
          { min: 98000, max: 109999, rate: 0.045 },
          { min: 110000, max: 124999, rate: 0.05 },
          { min: 125000, max: 139999, rate: 0.055 },
          { min: 140000, max: 151999, rate: 0.06 },
          { min: 152000, max: Infinity, rate: 0.065 }
        ];
        
        const threshold = hecsThresholds.find(t => taxableIncome >= t.min && taxableIncome <= t.max);
        hecsRepayment = threshold ? taxableIncome * threshold.rate : 0;
      }
    }

    const finalTax = Math.max(0, tax - lito + medicare + hecsRepayment);
    const refund = taxWithheldNum - finalTax;

    setResult({
      totalTFNIncome,
      abnIncomeNum,
      totalIncome, // Add totalIncome for HomeScreen display
      workFromHomeDeduction,
      totalManualDeductions,
      totalDeductions,
      taxableIncome,
      tax,
      lito,
      medicare,
      hecsRepayment,
      finalTax,
      totalTax: finalTax, // Add totalTax for HomeScreen display
      refund,
      effectiveTaxRate: taxableIncome > 0 ? (finalTax / taxableIncome * 100) : 0
    });

    // Complete the calculation after final loading step
    setTimeout(() => {
      setIsCalculating(false);
      setLoadingStep(0);
      setShowSuccessAnimation(true);
      setCurrentStep(4);
      // Scroll to top when calculation completes
      setTimeout(() => scrollToTop(), 100);

      // Hide success animation after 3 seconds
      setTimeout(() => {
        setShowSuccessAnimation(false);
      }, 3000);
    }, 2400); // Complete after all loading steps
  }, [jobIncomes, abnIncome, taxWithheld, deductions, workFromHomeHours, hecsDebt, medicareExemption, dependents, hasDependents]);



  const exportCSV = async () => {
    if (!result) return;
    
    const headers = [
      'Date', 'TFN Income', 'ABN Income', 'WFH Deduction', 'Manual Deductions', 'Total Deductions',
      'Taxable Income', 'Gross Tax', 'LITO', 'Medicare', 'HECS', 'Final Tax', 'Refund/Owing'
    ];
    const row = [
      new Date().toLocaleDateString('en-AU'),
      result.totalTFNIncome.toFixed(2),
      result.abnIncomeNum.toFixed(2),
      result.workFromHomeDeduction.toFixed(2),
      result.totalManualDeductions.toFixed(2),
      result.totalDeductions.toFixed(2),
      result.taxableIncome.toFixed(2),
      result.tax.toFixed(2),
      result.lito.toFixed(2),
      result.medicare.toFixed(2),
      result.hecsRepayment.toFixed(2),
      result.finalTax.toFixed(2),
      result.refund.toFixed(2)
    ];
    
    const csv = `${headers.join(',')}\n${row.join(',')}`;
    const filename = `TaxMate_${new Date().toISOString().split('T')[0]}.csv`;
    const path = FileSystem.documentDirectory + filename;
    
    try {
      await FileSystem.writeAsStringAsync(path, csv, { encoding: FileSystem.EncodingType.UTF8 });
      await Sharing.shareAsync(path, { dialogTitle: 'Export Tax Summary' });
    } catch (error) {
      Alert.alert('Export Error', 'Failed to export CSV file');
    }
  };

  const exportPDF = async () => {
    if (!result) return;

    try {
      // Create HTML content for the PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Tax Calculation Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #4A90E2; padding-bottom: 20px; }
            .title { color: #4A90E2; font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .date { color: #666; font-size: 14px; }
            .section { margin-bottom: 25px; }
            .section-title { color: #2D3748; font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 1px solid #E2E8F0; padding-bottom: 5px; }
            .summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
            .summary-card { background: #F8FAFC; padding: 15px; border-radius: 8px; border: 1px solid #E2E8F0; }
            .summary-label { font-size: 12px; color: #64748B; text-transform: uppercase; font-weight: 600; margin-bottom: 5px; }
            .summary-amount { font-size: 20px; font-weight: bold; color: #2D3748; }
            .breakdown-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            .breakdown-table th, .breakdown-table td { padding: 10px; text-align: left; border-bottom: 1px solid #E2E8F0; }
            .breakdown-table th { background: #F8FAFC; font-weight: 600; color: #2D3748; }
            .breakdown-table .total-row { font-weight: bold; border-top: 2px solid #4A90E2; background: #F0F9FF; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #E2E8F0; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">Australian Tax Calculation Report</div>
            <div class="date">Generated on ${new Date().toLocaleDateString('en-AU', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</div>
          </div>

          <div class="section">
            <div class="section-title">Summary</div>
            <div class="summary-grid">
              <div class="summary-card">
                <div class="summary-label">Total Income</div>
                <div class="summary-amount">${formatCurrency(result.totalTFNIncome + result.abnIncomeNum).replace('$', '$')}</div>
              </div>
              <div class="summary-card">
                <div class="summary-label">Total Deductions</div>
                <div class="summary-amount">${formatCurrency(result.totalDeductions).replace('$', '$')}</div>
              </div>
              <div class="summary-card">
                <div class="summary-label">Taxable Income</div>
                <div class="summary-amount">${formatCurrency(result.taxableIncome).replace('$', '$')}</div>
              </div>
              <div class="summary-card">
                <div class="summary-label">${result.refund >= 0 ? 'Tax Refund' : 'Tax Owing'}</div>
                <div class="summary-amount" style="color: ${result.refund >= 0 ? '#28a745' : '#dc3545'}">${formatCurrency(Math.abs(result.refund)).replace('$', '$')}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Income Breakdown</div>
            <table class="breakdown-table">
              <tr><th>Source</th><th>Amount</th></tr>
              <tr><td>Employment Income (TFN)</td><td>${formatCurrency(result.totalTFNIncome).replace('$', '$')}</td></tr>
              <tr><td>ABN/Freelance Income</td><td>${formatCurrency(result.abnIncomeNum).replace('$', '$')}</td></tr>
              <tr class="total-row"><td>Total Income</td><td>${formatCurrency(result.totalTFNIncome + result.abnIncomeNum).replace('$', '$')}</td></tr>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Deductions Breakdown</div>
            <table class="breakdown-table">
              <tr><th>Category</th><th>Type</th><th>Amount</th></tr>

              <!-- Work-Related Expenses -->
              <tr class="category-header"><td colspan="3"><strong>Work-Related Expenses</strong></td></tr>
              <tr><td></td><td>Travel Expenses</td><td>${formatCurrency(parseFloat(deductions.workRelated.travel || '0')).replace('$', '$')}</td></tr>
              <tr><td></td><td>Equipment & Tools</td><td>${formatCurrency(parseFloat(deductions.workRelated.equipment || '0')).replace('$', '$')}</td></tr>
              <tr><td></td><td>Uniforms & Protective Clothing</td><td>${formatCurrency(parseFloat(deductions.workRelated.uniforms || '0')).replace('$', '$')}</td></tr>
              <tr><td></td><td>Professional Memberships</td><td>${formatCurrency(parseFloat(deductions.workRelated.memberships || '0')).replace('$', '$')}</td></tr>
              <tr><td></td><td>Other Work Expenses</td><td>${formatCurrency(parseFloat(deductions.workRelated.other || '0')).replace('$', '$')}</td></tr>

              <!-- Self-Education Expenses -->
              <tr class="category-header"><td colspan="3"><strong>Self-Education Expenses</strong></td></tr>
              <tr><td></td><td>Course Fees & Tuition</td><td>${formatCurrency(parseFloat(deductions.selfEducation.courseFees || '0')).replace('$', '$')}</td></tr>
              <tr><td></td><td>Textbooks & Materials</td><td>${formatCurrency(parseFloat(deductions.selfEducation.textbooks || '0')).replace('$', '$')}</td></tr>
              <tr><td></td><td>Conferences & Seminars</td><td>${formatCurrency(parseFloat(deductions.selfEducation.conferences || '0')).replace('$', '$')}</td></tr>
              <tr><td></td><td>Professional Certifications</td><td>${formatCurrency(parseFloat(deductions.selfEducation.certifications || '0')).replace('$', '$')}</td></tr>
              <tr><td></td><td>Other Education Expenses</td><td>${formatCurrency(parseFloat(deductions.selfEducation.other || '0')).replace('$', '$')}</td></tr>

              <!-- Charitable Donations -->
              <tr class="category-header"><td colspan="3"><strong>Charitable Donations</strong></td></tr>
              <tr><td></td><td>Charitable Donations</td><td>${formatCurrency(parseFloat(deductions.donations.charitable || '0')).replace('$', '$')}</td></tr>
              <tr><td></td><td>Disaster Relief Donations</td><td>${formatCurrency(parseFloat(deductions.donations.disasterRelief || '0')).replace('$', '$')}</td></tr>
              <tr><td></td><td>Religious Organization Donations</td><td>${formatCurrency(parseFloat(deductions.donations.religious || '0')).replace('$', '$')}</td></tr>
              <tr><td></td><td>Other Donations</td><td>${formatCurrency(parseFloat(deductions.donations.other || '0')).replace('$', '$')}</td></tr>

              <!-- Other Deductions -->
              <tr class="category-header"><td colspan="3"><strong>Other Deductions</strong></td></tr>
              <tr><td></td><td>Investment Expenses</td><td>${formatCurrency(parseFloat(deductions.other.investment || '0')).replace('$', '$')}</td></tr>
              <tr><td></td><td>Tax Agent & Accounting Fees</td><td>${formatCurrency(parseFloat(deductions.other.taxAgent || '0')).replace('$', '$')}</td></tr>
              <tr><td></td><td>Income Protection Insurance</td><td>${formatCurrency(parseFloat(deductions.other.incomeProtection || '0')).replace('$', '$')}</td></tr>
              <tr><td></td><td>Bank Fees & Investment Charges</td><td>${formatCurrency(parseFloat(deductions.other.bankFees || '0')).replace('$', '$')}</td></tr>
              <tr><td></td><td>Other Allowable Deductions</td><td>${formatCurrency(parseFloat(deductions.other.other || '0')).replace('$', '$')}</td></tr>

              <!-- Work From Home -->
              <tr class="category-header"><td colspan="3"><strong>Work From Home</strong></td></tr>
              <tr><td></td><td>Work From Home (${workFromHomeHours || 0} hrs)</td><td>${formatCurrency(result.workFromHomeDeduction).replace('$', '$')}</td></tr>

              <tr class="total-row"><td colspan="2"><strong>Total Deductions</strong></td><td><strong>${formatCurrency(result.totalDeductions).replace('$', '$')}</strong></td></tr>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Tax Calculation</div>
            <table class="breakdown-table">
              <tr><th>Component</th><th>Amount</th></tr>
              <tr><td>Taxable Income</td><td>${formatCurrency(result.taxableIncome).replace('$', '$')}</td></tr>
              <tr><td>Income Tax</td><td>${formatCurrency(result.tax).replace('$', '$')}</td></tr>
              <tr><td>Low Income Tax Offset</td><td>-${formatCurrency(result.lito).replace('$', '$')}</td></tr>
              <tr><td>Medicare Levy</td><td>${formatCurrency(result.medicare).replace('$', '$')}</td></tr>
              ${result.hecsRepayment > 0 ? `<tr><td>HECS-HELP Repayment</td><td>${formatCurrency(result.hecsRepayment).replace('$', '$')}</td></tr>` : ''}
              <tr><td>Tax Withheld (PAYG)</td><td>-${formatCurrency(parseFloat(taxWithheld || '0')).replace('$', '$')}</td></tr>
              <tr class="total-row"><td>${result.refund >= 0 ? 'Tax Refund' : 'Tax Owing'}</td><td style="color: ${result.refund >= 0 ? '#28a745' : '#dc3545'}">${formatCurrency(Math.abs(result.refund)).replace('$', '$')}</td></tr>
            </table>
          </div>

          <div class="footer">
            <p>This is an estimate only. Please consult a qualified tax professional for official tax advice.</p>
            <p>Generated by Australia Tax Return Calculator</p>
          </div>
        </body>
        </html>
      `;

      const fileName = `tax_calculation_${new Date().toISOString().split('T')[0]}.html`;
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, htmlContent);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/html',
          dialogTitle: 'Export Tax Calculation Report'
        });
      } else {
        Alert.alert('Success', `Report saved to ${fileUri}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export PDF report');
      console.error('PDF export error:', error);
    }
  };

  // Step Progress Indicator Component with integrated back button
  const StepIndicator = () => {
    // Check if step 1 is complete for navigation purposes
    const isStep1Complete = () => {
      const hasValidJobIncome = jobIncomes.some(income => {
        const trimmed = income?.trim();
        const parsed = parseFloat(trimmed);
        return trimmed && !isNaN(parsed) && parsed > 0;
      });

      const hasValidAbnIncome = abnIncome?.trim() && !isNaN(parseFloat(abnIncome.trim())) && parseFloat(abnIncome.trim()) > 0;
      const taxWithheldTrimmed = taxWithheld?.trim();
      const isValidTaxWithheld = taxWithheldTrimmed && !isNaN(parseFloat(taxWithheldTrimmed)) && parseFloat(taxWithheldTrimmed) >= 0;

      return (hasValidJobIncome || hasValidAbnIncome) && isValidTaxWithheld;
    };

    const step1Complete = isStep1Complete();

    return (
      <View style={styles.stepIndicatorContainer}>
        {/* Back button */}
        <TouchableOpacity
          style={styles.stepBackButton}
          onPress={handleBackNavigation}
        >
          <Ionicons name="chevron-back" size={20} color={theme.textSecondary} />
        </TouchableOpacity>

        {/* Step indicator */}
        <View style={styles.stepIndicator}>
          {[1, 2, 3, 4].map((step) => {
            // Determine if step is accessible
            const isAccessible = step === 1 || (step <= 3 && step1Complete) || (step === 4 && result);

            return (
              <View key={step} style={styles.stepIndicatorRow}>
                <TouchableOpacity
                  style={[
                    styles.stepCircle,
                    currentStep >= step && styles.stepCircleActive,
                    currentStep === step && styles.stepCircleCurrent,
                    !isAccessible && styles.stepCircleDisabled
                  ]}
                  onPress={() => goToStep(step)}
                  disabled={!isAccessible}
                >
                  <Text style={[
                    styles.stepNumber,
                    currentStep >= step && styles.stepNumberActive,
                    !isAccessible && styles.stepNumberDisabled
                  ]}>
                    {step}
                  </Text>
                </TouchableOpacity>
                <Text style={[
                  styles.stepLabel,
                  currentStep >= step && styles.stepLabelActive,
                  !isAccessible && styles.stepLabelDisabled
                ]}>
                  {step === 1 ? 'Income' : step === 2 ? 'Deductions' : step === 3 ? 'Details' : 'Results'}
                </Text>
                {step < 4 && <View style={[styles.stepLine, currentStep > step && styles.stepLineActive]} />}
              </View>
            );
          })}
        </View>
      </View>
    );
  };







  // Income category color mapping for consistency
  const getIncomeCategoryColors = (categoryKey) => {
    const colorMap = {
      employment: { primary: theme.categoryWork, light: theme.categoryWorkLight, accent: theme.categoryWork },
      abn: { primary: theme.categoryEducation, light: theme.categoryEducationLight, accent: theme.categoryEducation },
      payg: { primary: theme.categoryDonations, light: theme.categoryDonationsLight, accent: theme.categoryDonations }
    };
    return colorMap[categoryKey] || colorMap.employment;
  };

  // Toggle income category collapse state
  const toggleIncomeCategory = (categoryKey) => {
    setIncomeCollapsedCategories(prev => ({
      ...prev,
      [categoryKey]: !prev[categoryKey]
    }));
  };

  // Render income category header
  const renderIncomeCategoryHeader = (categoryKey, title, description, icon, total) => {
    const isCollapsed = incomeCollapsedCategories[categoryKey];
    const hasValues = total > 0;
    const colors = getIncomeCategoryColors(categoryKey);

    return (
      <TouchableOpacity
        style={[
          styles.deductionCategoryHeader,
          isCollapsed && styles.deductionCategoryHeaderCollapsed,
          { backgroundColor: hasValues ? colors.light : theme.surfaceSecondary }
        ]}
        onPress={() => toggleIncomeCategory(categoryKey)}
        activeOpacity={0.7}
      >
        <View style={styles.categoryHeaderLeft}>
          <View style={[
            styles.categoryIcon,
            { backgroundColor: hasValues ? colors.primary : colors.light },
            hasValues && styles.categoryIconActive
          ]}>
            <Ionicons
              name={icon}
              size={22}
              color={hasValues ? (isDark ? "#000" : "#fff") : colors.primary}
            />
          </View>
          <View style={styles.categoryTitleContainer}>
            <Text style={[styles.categoryTitle, hasValues && { color: colors.accent }]}>
              {title}
            </Text>
            <Text style={styles.categoryDescription}>{description}</Text>
            {total > 0 && (
              <Text style={[styles.categoryTotal, { color: colors.primary }]}>
                Total: {formatCurrency(total)}
              </Text>
            )}
          </View>
        </View>
        <View style={[styles.categoryToggle, hasValues && { borderColor: colors.primary }]}>
          <Ionicons
            name={isCollapsed ? "chevron-down" : "chevron-up"}
            size={20}
            color={hasValues ? colors.primary : "#64748B"}
          />
        </View>
      </TouchableOpacity>
    );
  };

  // Helper function to calculate rough tax estimate using proper 2024-25 brackets
  const calculateRoughTaxEstimate = (income) => {
    const taxableIncome = parseFloat(income || '0');
    if (taxableIncome <= 0) return 0;

    // 2024-25 tax brackets (simplified, no deductions considered)
    let tax = 0;
    if (taxableIncome > 180000) {
      tax = 51667 + (taxableIncome - 180000) * 0.45;
    } else if (taxableIncome > 120000) {
      tax = 29467 + (taxableIncome - 120000) * 0.37;
    } else if (taxableIncome > 45000) {
      tax = (45000 - 18200) * 0.19 + (taxableIncome - 45000) * 0.325;
    } else if (taxableIncome > 18200) {
      tax = (taxableIncome - 18200) * 0.19;
    }

    // Add Medicare levy (2%)
    if (taxableIncome > 27222) {
      tax += taxableIncome * 0.02;
    }

    return Math.round(tax);
  };

  // Helper function to calculate tax savings from deductions using marginal tax rate
  const calculateTaxSavings = (deductionAmount) => {
    const deductions = parseFloat(deductionAmount || '0');
    if (deductions <= 0) return 0;

    // Get current total income to determine marginal tax rate
    const parsedJobIncomes = jobIncomes.map((val) => parseFloat(val || '0'));
    const totalTFNIncome = parsedJobIncomes.reduce((sum, curr) => sum + (isNaN(curr) ? 0 : curr), 0);
    const abnIncomeNum = parseFloat(abnIncome || '0');
    const totalIncome = totalTFNIncome + abnIncomeNum;

    // Determine marginal tax rate based on income level (2024-25)
    let marginalRate = 0;
    if (totalIncome > 180000) {
      marginalRate = 0.45 + 0.02; // 45% + 2% Medicare levy
    } else if (totalIncome > 120000) {
      marginalRate = 0.37 + 0.02; // 37% + 2% Medicare levy
    } else if (totalIncome > 45000) {
      marginalRate = 0.325 + 0.02; // 32.5% + 2% Medicare levy
    } else if (totalIncome > 27222) {
      marginalRate = 0.19 + 0.02; // 19% + 2% Medicare levy
    } else if (totalIncome > 18200) {
      marginalRate = 0.19; // 19% (below Medicare levy threshold)
    } else {
      marginalRate = 0; // Tax-free threshold
    }

    return Math.round(deductions * marginalRate);
  };

  const renderIncomeTab = () => {
    const employmentTotal = jobIncomes.reduce((sum, income) => sum + parseFloat(income || '0'), 0);
    const abnTotal = parseFloat(abnIncome || '0');
    const paygTotal = parseFloat(taxWithheld || '0');
    const totalIncome = employmentTotal + abnTotal;
    // Use proper tax calculation instead of flat rate
    const estimatedTax = calculateRoughTaxEstimate(totalIncome);
    const estimatedRefund = paygTotal - estimatedTax;

    return (
      <View style={styles.tabContent}>
        <Text style={styles.sectionTitle}>Income & Tax Withheld</Text>





        {/* Enhanced Real-time Income Summary */}
        {totalIncome > 0 && (
          <View style={styles.deductionSummary}>
            <View style={styles.summaryHeader}>
              <Ionicons name="wallet-outline" size={20} color={theme.primary} />
              <Text style={styles.summaryTitle}>Income Summary</Text>
              <View style={styles.summaryBadge}>
                <Text style={styles.summaryBadgeText}>
                  {[employmentTotal, abnTotal].filter(t => t > 0).length} sources
                </Text>
              </View>
            </View>
            <Text style={styles.summaryAmount}>{formatCurrency(totalIncome)}</Text>

            {/* Income Breakdown */}
            <View style={styles.summaryBreakdown}>
              {employmentTotal > 0 && (
                <View style={styles.summaryBreakdownItem}>
                  <View style={[styles.summaryBreakdownDot, { backgroundColor: theme.primary }]} />
                  <Text style={styles.summaryBreakdownLabel}>Employment</Text>
                  <Text style={styles.summaryBreakdownValue}>{formatCurrency(employmentTotal)}</Text>
                </View>
              )}
              {abnTotal > 0 && (
                <View style={styles.summaryBreakdownItem}>
                  <View style={[styles.summaryBreakdownDot, { backgroundColor: theme.categoryEducation }]} />
                  <Text style={styles.summaryBreakdownLabel}>ABN/Freelance</Text>
                  <Text style={styles.summaryBreakdownValue}>{formatCurrency(abnTotal)}</Text>
                </View>
              )}
            </View>

            {/* Tax Estimate */}
            <View style={[styles.taxSavingsEstimate, { backgroundColor: theme.warningLight, borderColor: theme.warning }]}>
              <Ionicons name="calculator" size={16} color={theme.warning} />
              <Text style={[styles.taxSavingsText, { color: theme.warning }]}>
                Estimated tax liability: {formatCurrency(estimatedTax)}
              </Text>
            </View>
          </View>
        )}



        {/* Employment Income Section */}
        <View style={styles.deductionCategory}>
          {renderIncomeCategoryHeader(
            'employment',
            'Employment Income (TFN Jobs)',
            'Salary, wages, and other employment income with tax withheld',
            'briefcase-outline',
            employmentTotal
          )}

          {!incomeCollapsedCategories.employment && (
            <View style={styles.categoryContent}>
              {jobIncomes.map((val, idx) => (
                <View key={idx} style={styles.jobIncomeRow}>
                  <View style={styles.flexInput}>
                    <InputField
                      label={`Job ${idx + 1}`}
                      value={val}
                      onChangeText={jobIncomeCallbacks[idx]}
                      placeholder="Annual salary (e.g., 65000)"
                      icon="briefcase-outline"
                      helpKey="jobIncome"
                      error={validationErrors[`jobIncome_${idx}`]}
                      prefix="$"
                    />
                  </View>
                  {jobIncomes.length > 1 && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeJobIncomeField(idx)}
                    >
                      <Ionicons name="close-circle" size={24} color={theme.error} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              <TouchableOpacity style={styles.addButton} onPress={addJobIncomeField}>
                <Ionicons name="add-circle-outline" size={20} color="#ffffff" />
                <Text style={styles.addButtonText}>Add Another Job</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ABN/Freelance Income Section */}
        <View style={styles.deductionCategory}>
          {renderIncomeCategoryHeader(
            'abn',
            'ABN/Freelance Income',
            'Self-employed, contractor, or freelance income',
            'business-outline',
            abnTotal
          )}

          {!incomeCollapsedCategories.abn && (
            <View style={styles.categoryContent}>
              <InputField
                label="ABN/Freelance Income"
                value={abnIncome}
                onChangeText={(value) => {
                  setAbnIncome(value);
                  clearFieldError('abnIncome');

                  // Note: ABN income changes don't affect PAYG tax withheld estimation
                  // as PAYG tax is only withheld from employment income (TFN), not ABN income
                }}
                placeholder="Self-employed income (e.g., 15000)"
                icon="business-outline"
                helpKey="abnIncome"
                error={validationErrors.abnIncome}
                prefix="$"
              />
            </View>
          )}
        </View>

        {/* Tax Withheld (PAYG) Section */}
        <View style={styles.deductionCategory}>
          {renderIncomeCategoryHeader(
            'payg',
            'Tax Withheld (PAYG)',
            'Total tax withheld from your employment income',
            'card-outline',
            paygTotal
          )}

          {!incomeCollapsedCategories.payg && (
            <View style={styles.categoryContent}>
              <InputField
                label="Tax Withheld (PAYG)"
                value={taxWithheld}
                onChangeText={(value) => {
                  if (!paygUnknown) {
                    setTaxWithheld(value);
                    clearFieldError('taxWithheld');
                  }
                }}
                placeholder={paygUnknown ? "Estimated" : "Total tax withheld (e.g., 12500)"}
                icon="card-outline"
                helpKey="taxWithheld"
                error={validationErrors.taxWithheld}
                editable={!paygUnknown}
                prefix="$"
              />

              <TouchableOpacity
                style={[styles.toggleButton, paygUnknown && styles.toggleButtonActive]}
                onPress={handlePaygUnknownToggle}
              >
                <Ionicons
                  name={paygUnknown ? "checkbox-outline" : "square-outline"}
                  size={24}
                  color={paygUnknown ? theme.primary : theme.textSecondary}
                />
                <Text style={[styles.toggleText, paygUnknown && styles.toggleTextActive]}>
                  I don't know my PAYG withholding amount
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Next Button */}
        <View style={styles.stepButtonContainer}>
          <TouchableOpacity
            style={styles.stepButtonNext}
            onPress={nextStep}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#4A90E2', '#2C5F8C']}
              style={styles.stepButtonNextGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.stepButtonNextIconContainer}>
                <Ionicons name="chevron-forward" size={20} color="#fff" />
              </View>
              <Text style={styles.stepButtonNextText}>Next</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

      </View>
    );
  };

  // Helper function to calculate category totals
  const calculateCategoryTotal = (categoryData) => {
    return Object.values(categoryData).reduce((sum, value) => {
      const num = parseFloat(value || '0');
      return sum + (isNaN(num) ? 0 : num);
    }, 0);
  };

  // Helper function to estimate tax withheld based on TFN employment income only
  // Note: This should only be used for employment income, not ABN/business income
  const estimateTaxWithheld = (income) => {
    const annualIncome = parseFloat(income || '0');
    if (annualIncome <= 0) return 0;

    // Australian tax brackets 2024-25
    let tax = 0;
    if (annualIncome > 18200) {
      if (annualIncome <= 45000) {
        tax = (annualIncome - 18200) * 0.19;
      } else if (annualIncome <= 120000) {
        tax = (45000 - 18200) * 0.19 + (annualIncome - 45000) * 0.325;
      } else if (annualIncome <= 180000) {
        tax = (45000 - 18200) * 0.19 + (120000 - 45000) * 0.325 + (annualIncome - 120000) * 0.37;
      } else {
        tax = (45000 - 18200) * 0.19 + (120000 - 45000) * 0.325 + (180000 - 120000) * 0.37 + (annualIncome - 180000) * 0.45;
      }
    }

    // Add Medicare levy (2%)
    if (annualIncome > 23226) {
      tax += annualIncome * 0.02;
    }

    return Math.round(tax);
  };



  // Helper function to check if category has any values
  const categoryHasValues = (categoryData) => {
    return Object.values(categoryData).some(value => value && value.trim() !== '');
  };

  // Toggle category collapse state
  const toggleCategory = (categoryKey) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [categoryKey]: !prev[categoryKey]
    }));
  };

  // Category color mapping for better visual hierarchy
  const getCategoryColors = (categoryKey) => {
    const colorMap = {
      workRelated: { primary: theme.categoryWork, light: theme.categoryWorkLight, accent: theme.categoryWork },
      selfEducation: { primary: theme.categoryEducation, light: theme.categoryEducationLight, accent: theme.categoryEducation },
      donations: { primary: theme.categoryDonations, light: theme.categoryDonationsLight, accent: theme.categoryDonations },
      other: { primary: theme.categoryOther, light: theme.categoryOtherLight, accent: theme.categoryOther },
      workFromHome: { primary: theme.categoryHome, light: theme.categoryHomeLight, accent: theme.categoryHome }
    };
    return colorMap[categoryKey] || colorMap.workRelated;
  };

  // Render collapsible category header with enhanced visual design
  const renderCategoryHeader = (categoryKey, title, description, icon, total) => {
    const isCollapsed = collapsedCategories[categoryKey];
    // For work from home, use the total parameter; for others, check the deductions object
    const hasValues = categoryKey === 'workFromHome' ? total > 0 : categoryHasValues(deductions[categoryKey] || {});
    const colors = getCategoryColors(categoryKey);

    return (
      <TouchableOpacity
        style={[
          styles.deductionCategoryHeader,
          isCollapsed && styles.deductionCategoryHeaderCollapsed,
          { backgroundColor: hasValues ? colors.light : theme.surfaceSecondary }
        ]}
        onPress={() => toggleCategory(categoryKey)}
        activeOpacity={0.7}
      >
        <View style={styles.categoryHeaderLeft}>
          <View style={[
            styles.categoryIcon,
            { backgroundColor: hasValues ? colors.primary : colors.light },
            hasValues && styles.categoryIconActive
          ]}>
            <Ionicons
              name={icon}
              size={22}
              color={hasValues ? (isDark ? "#000" : "#fff") : colors.primary}
            />
          </View>
          <View style={styles.categoryTitleContainer}>
            <Text style={[styles.categoryTitle, hasValues && { color: colors.accent }]}>
              {title}
            </Text>
            <Text style={styles.categoryDescription}>{description}</Text>
            {total > 0 && (
              <Text style={[styles.categoryTotal, { color: colors.primary }]}>
                Total: {formatCurrency(total)}
              </Text>
            )}
          </View>
        </View>
        <View style={[styles.categoryToggle, hasValues && { borderColor: colors.primary }]}>
          <Ionicons
            name={isCollapsed ? "chevron-down" : "chevron-up"}
            size={20}
            color={hasValues ? colors.primary : "#64748B"}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderDeductionsTab = () => {
    const workRelatedTotal = calculateCategoryTotal(deductions.workRelated);
    const selfEducationTotal = calculateCategoryTotal(deductions.selfEducation);
    const donationsTotal = calculateCategoryTotal(deductions.donations);
    const otherTotal = calculateCategoryTotal(deductions.other);
    const wfhTotal = parseFloat(workFromHomeHours || '0') * 0.67;
    const grandTotal = workRelatedTotal + selfEducationTotal + donationsTotal + otherTotal + wfhTotal;

    return (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Tax Deductions</Text>



      {/* Quick Add Common Deductions */}
      {grandTotal === 0 && (
        <View style={styles.quickAddContainer}>
          <Text style={styles.quickAddTitle}>Quick Add Common Deductions</Text>
          <Text style={styles.quickAddSubtitle}>Tap to add typical amounts, then customize as needed</Text>
          <View style={styles.quickAddGrid}>
            <TouchableOpacity
              style={styles.quickAddButton}
              onPress={() => {
                updateWorkRelatedTravel('450');
                updateWorkRelatedEquipment('800');
                toggleCategory('workRelated');
              }}
            >
              <Ionicons name="briefcase" size={20} color={theme.primary} />
              <Text style={styles.quickAddButtonText}>Work Basics</Text>
              <Text style={styles.quickAddButtonAmount}>$1,250</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAddButton}
              onPress={() => {
                updateSelfEducationCourseFees('1200');
                toggleCategory('selfEducation');
              }}
            >
              <Ionicons name="school" size={20} color={theme.success} />
              <Text style={styles.quickAddButtonText}>Training</Text>
              <Text style={styles.quickAddButtonAmount}>$1,200</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAddButton}
              onPress={() => {
                updateDonationsCharitable('300');
                toggleCategory('donations');
              }}
            >
              <Ionicons name="heart" size={20} color={theme.warning} />
              <Text style={styles.quickAddButtonText}>Donations</Text>
              <Text style={styles.quickAddButtonAmount}>$300</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAddButton}
              onPress={() => {
                setWorkFromHomeHours('400');
                toggleCategory('workFromHome');
              }}
            >
              <Ionicons name="home" size={20} color={theme.error} />
              <Text style={styles.quickAddButtonText}>WFH</Text>
              <Text style={styles.quickAddButtonAmount}>$268</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}



      {/* Enhanced Real-time Deduction Summary */}
      {grandTotal > 0 && (
        <View style={styles.deductionSummary}>
          <View style={styles.summaryHeader}>
            <Ionicons name="calculator-outline" size={20} color={theme.primary} />
            <Text style={styles.summaryTitle}>Total Deductions</Text>
            <View style={styles.summaryBadge}>
              <Text style={styles.summaryBadgeText}>
                {[workRelatedTotal, selfEducationTotal, donationsTotal, otherTotal, wfhTotal].filter(t => t > 0).length} categories
              </Text>
            </View>
          </View>
          <Text style={styles.summaryAmount}>{formatCurrency(grandTotal)}</Text>

          {/* Category Breakdown */}
          <View style={styles.summaryBreakdown}>
            {workRelatedTotal > 0 && (
              <View style={styles.summaryBreakdownItem}>
                <View style={[styles.summaryBreakdownDot, { backgroundColor: theme.primary }]} />
                <Text style={styles.summaryBreakdownLabel}>Work-Related</Text>
                <Text style={styles.summaryBreakdownValue}>{formatCurrency(workRelatedTotal)}</Text>
              </View>
            )}
            {selfEducationTotal > 0 && (
              <View style={styles.summaryBreakdownItem}>
                <View style={[styles.summaryBreakdownDot, { backgroundColor: theme.categoryEducation }]} />
                <Text style={styles.summaryBreakdownLabel}>Self-Education</Text>
                <Text style={styles.summaryBreakdownValue}>{formatCurrency(selfEducationTotal)}</Text>
              </View>
            )}
            {donationsTotal > 0 && (
              <View style={styles.summaryBreakdownItem}>
                <View style={[styles.summaryBreakdownDot, { backgroundColor: theme.categoryDonations }]} />
                <Text style={styles.summaryBreakdownLabel}>Donations</Text>
                <Text style={styles.summaryBreakdownValue}>{formatCurrency(donationsTotal)}</Text>
              </View>
            )}
            {otherTotal > 0 && (
              <View style={styles.summaryBreakdownItem}>
                <View style={[styles.summaryBreakdownDot, { backgroundColor: theme.categoryOther }]} />
                <Text style={styles.summaryBreakdownLabel}>Other</Text>
                <Text style={styles.summaryBreakdownValue}>{formatCurrency(otherTotal)}</Text>
              </View>
            )}
            {wfhTotal > 0 && (
              <View style={styles.summaryBreakdownItem}>
                <View style={[styles.summaryBreakdownDot, { backgroundColor: theme.categoryHome }]} />
                <Text style={styles.summaryBreakdownLabel}>Work From Home</Text>
                <Text style={styles.summaryBreakdownValue}>{formatCurrency(wfhTotal)}</Text>
              </View>
            )}
          </View>

          {/* Tax Savings Estimate */}
          <View style={styles.taxSavingsEstimate}>
            <Ionicons name="cash-outline" size={16} color={theme.success} />
            <Text style={styles.taxSavingsText}>
              Estimated tax savings: {formatCurrency(calculateTaxSavings(grandTotal))} (marginal tax rate)
            </Text>
          </View>


        </View>
      )}



      {/* Show All Categories Button */}
      {Object.values(collapsedCategories).some(collapsed => collapsed) && (
        <View style={styles.showAllContainer}>
          <TouchableOpacity
            style={styles.showAllButton}
            onPress={() => {
              setCollapsedCategories({
                workRelated: false,
                selfEducation: false,
                donations: false,
                other: false,
                workFromHome: false
              });
            }}
          >
            <Ionicons name="expand-outline" size={20} color={theme.textSecondary} />
            <Text style={styles.showAllButtonText}>Show All Categories</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Work-Related Expenses Section */}
      <View style={styles.deductionCategory}>
        {renderCategoryHeader(
          'workRelated',
          'Work-Related Expenses',
          'Most common deductions - expenses directly related to earning income',
          'briefcase-outline',
          workRelatedTotal
        )}

        {!collapsedCategories.workRelated && (
          <View style={styles.categoryContent}>
            <InputField
              label="Travel Expenses"
              value={deductions.workRelated.travel}
              onChangeText={updateWorkRelatedTravel}
              placeholder="Work travel, client visits (e.g., 450)"
              icon="car-outline"
              helpKey="workRelatedTravel"
              prefix="$"
            />

            <InputField
              label="Equipment & Tools"
              value={deductions.workRelated.equipment}
              onChangeText={updateWorkRelatedEquipment}
              placeholder="Tools, computer equipment (e.g., 800)"
              icon="construct-outline"
              helpKey="workRelatedEquipment"
              prefix="$"
            />

            <InputField
              label="Uniforms & Protective Clothing"
              value={deductions.workRelated.uniforms}
              onChangeText={updateWorkRelatedUniforms}
              placeholder="Work uniforms, safety gear (e.g., 300)"
              icon="shirt-outline"
              helpKey="workRelatedUniforms"
              prefix="$"
            />

            <InputField
              label="Professional Memberships"
              value={deductions.workRelated.memberships}
              onChangeText={updateWorkRelatedMemberships}
              placeholder="Union fees, professional bodies (e.g., 350)"
              icon="people-outline"
              helpKey="workRelatedMemberships"
              prefix="$"
            />

            <InputField
              label="Other Work Expenses"
              value={deductions.workRelated.other}
              onChangeText={updateWorkRelatedOther}
              placeholder="Other work-related costs (e.g., 200)"
              icon="ellipsis-horizontal-outline"
              helpKey="workRelated"
              prefix="$"
            />
          </View>
        )}
      </View>

      {/* Self-Education Expenses Section */}
      <View style={styles.deductionCategory}>
        {renderCategoryHeader(
          'selfEducation',
          'Self-Education Expenses',
          'Education costs directly related to your current work',
          'school-outline',
          selfEducationTotal
        )}

        {!collapsedCategories.selfEducation && (
          <View style={styles.categoryContent}>
            <InputField
              label="Course Fees & Tuition"
              value={deductions.selfEducation.courseFees}
              onChangeText={updateSelfEducationCourseFees}
              placeholder="Professional courses, training (e.g., 1200)"
              icon="school-outline"
              helpKey="selfEducationCourseFees"
              prefix="$"
            />

            <InputField
              label="Textbooks & Materials"
              value={deductions.selfEducation.textbooks}
              onChangeText={updateSelfEducationTextbooks}
              placeholder="Study materials, books (e.g., 300)"
              icon="book-outline"
              helpKey="selfEducationTextbooks"
              prefix="$"
            />

            <InputField
              label="Conferences & Seminars"
              value={deductions.selfEducation.conferences}
              onChangeText={updateSelfEducationConferences}
              placeholder="Professional events (e.g., 600)"
              icon="people-circle-outline"
              helpKey="selfEducationConferences"
              prefix="$"
            />

            <InputField
              label="Professional Certifications"
              value={deductions.selfEducation.certifications}
              onChangeText={updateSelfEducationCertifications}
              placeholder="License renewals, exams (e.g., 400)"
              icon="ribbon-outline"
              helpKey="selfEducationCertifications"
              prefix="$"
            />

            <InputField
              label="Other Education Expenses"
              value={deductions.selfEducation.other}
              onChangeText={updateSelfEducationOther}
              placeholder="Other learning costs (e.g., 200)"
              icon="ellipsis-horizontal-outline"
              helpKey="selfEducation"
              prefix="$"
            />
          </View>
        )}
      </View>

      {/* Charitable Donations Section */}
      <View style={styles.deductionCategory}>
        {renderCategoryHeader(
          'donations',
          'Charitable Donations',
          'Tax-deductible donations to registered charities (DGR status required)',
          'heart-outline',
          donationsTotal
        )}

        {!collapsedCategories.donations && (
          <View style={styles.categoryContent}>
            <InputField
              label="Charitable Donations"
              value={deductions.donations.charitable}
              onChangeText={updateDonationsCharitable}
              placeholder="Regular charity donations (e.g., 300)"
              icon="heart-outline"
              helpKey="donationsCharitable"
              prefix="$"
            />

            <InputField
              label="Disaster Relief Donations"
              value={deductions.donations.disasterRelief}
              onChangeText={updateDonationsDisasterRelief}
              placeholder="Emergency appeals (e.g., 250)"
              icon="shield-outline"
              helpKey="donationsDisasterRelief"
              prefix="$"
            />

            <InputField
              label="Religious Organization Donations"
              value={deductions.donations.religious}
              onChangeText={updateDonationsReligious}
              placeholder="Faith-based charities (e.g., 200)"
              icon="library-outline"
              helpKey="donationsReligious"
              prefix="$"
            />

            <InputField
              label="Other Donations"
              value={deductions.donations.other}
              onChangeText={updateDonationsOther}
              placeholder="Other DGR donations (e.g., 150)"
              icon="ellipsis-horizontal-outline"
              helpKey="donations"
              prefix="$"
            />
          </View>
        )}
      </View>

      {/* Other Deductions Section */}
      <View style={styles.deductionCategory}>
        {renderCategoryHeader(
          'other',
          'Other Deductions',
          'Other allowable tax deductions not covered above',
          'document-text-outline',
          otherTotal
        )}

        {!collapsedCategories.other && (
          <View style={styles.categoryContent}>
            <InputField
              label="Investment Expenses"
              value={deductions.other.investment}
              onChangeText={updateOtherInvestment}
              placeholder="Property, share expenses (e.g., 800)"
              icon="trending-up-outline"
              helpKey="otherInvestment"
              prefix="$"
            />

            <InputField
              label="Tax Agent & Accounting Fees"
              value={deductions.other.taxAgent}
              onChangeText={updateOtherTaxAgent}
              placeholder="Tax preparation fees (e.g., 350)"
              icon="calculator-outline"
              helpKey="otherTaxAgent"
              prefix="$"
            />

            <InputField
              label="Income Protection Insurance"
              value={deductions.other.incomeProtection}
              onChangeText={updateOtherIncomeProtection}
              placeholder="Income protection premiums (e.g., 600)"
              icon="shield-checkmark-outline"
              helpKey="otherIncomeProtection"
              prefix="$"
            />

            <InputField
              label="Bank Fees & Investment Charges"
              value={deductions.other.bankFees}
              onChangeText={updateOtherBankFees}
              placeholder="Investment account fees (e.g., 150)"
              icon="card-outline"
              helpKey="otherBankFees"
              prefix="$"
            />

            <InputField
              label="Other Allowable Deductions"
              value={deductions.other.other}
              onChangeText={updateOtherOther}
              placeholder="Other deductible expenses (e.g., 200)"
              icon="ellipsis-horizontal-outline"
              helpKey="otherDeductions"
              prefix="$"
            />
          </View>
        )}
      </View>

      {/* Work From Home Section */}
      <View style={styles.deductionCategory}>
        {renderCategoryHeader(
          'workFromHome',
          'Work From Home',
          'Simplified method: $0.67 per hour worked from home',
          'home-outline',
          wfhTotal
        )}

        {!collapsedCategories.workFromHome && (
          <View style={styles.categoryContent}>
            <InputField
              label="Work From Home Hours"
              value={workFromHomeHours}
              onChangeText={setWorkFromHomeHours}
              placeholder="Total WFH hours (e.g., 400 = $268 deduction)"
              icon="home-outline"
              helpKey="workFromHome"
              suffix=" hrs"
            />

            <View style={styles.wfhInfo}>
              <Ionicons name="information-circle-outline" size={16} color="#666" />
              <Text style={styles.infoText}>
                Work from home calculated at $0.67/hour (ATO shortcut method)
              </Text>
            </View>
          </View>
        )}

      </View>

      {/* Next Button */}
      <View style={styles.stepButtonContainer}>
        <TouchableOpacity
          style={styles.stepButtonNext}
          onPress={nextStep}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#4A90E2', '#2C5F8C']}
            style={styles.stepButtonNextGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.stepButtonNextIconContainer}>
              <Ionicons name="chevron-forward" size={20} color="#fff" />
            </View>
            <Text style={styles.stepButtonNextText}>Next</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

    </View>
  );
  };

  // Additional details category color mapping
  const getDetailsCategoryColors = (categoryKey) => {
    const colorMap = {
      hecsDebt: { primary: theme.categoryWork, light: theme.categoryWorkLight, accent: theme.categoryWork },
      medicareLevy: { primary: theme.categoryPink, light: theme.categoryPinkLight, accent: theme.categoryPink },
      disclaimer: { primary: theme.categoryDonations, light: theme.categoryDonationsLight, accent: theme.categoryDonations }
    };
    return colorMap[categoryKey] || colorMap.hecsDebt;
  };

  // Toggle details category collapse state
  const toggleDetailsCategory = (categoryKey) => {
    setDetailsCollapsedCategories(prev => ({
      ...prev,
      [categoryKey]: !prev[categoryKey]
    }));
  };

  // Render details category header
  const renderDetailsCategoryHeader = (categoryKey, title, description, icon, hasValues) => {
    const isCollapsed = detailsCollapsedCategories[categoryKey];
    const colors = getDetailsCategoryColors(categoryKey);

    return (
      <TouchableOpacity
        style={[
          styles.deductionCategoryHeader,
          isCollapsed && styles.deductionCategoryHeaderCollapsed,
          { backgroundColor: hasValues ? colors.light : theme.surfaceSecondary }
        ]}
        onPress={() => toggleDetailsCategory(categoryKey)}
        activeOpacity={0.7}
      >
        <View style={styles.categoryHeaderLeft}>
          <View style={[
            styles.categoryIcon,
            { backgroundColor: hasValues ? colors.primary : colors.light },
            hasValues && styles.categoryIconActive
          ]}>
            <Ionicons
              name={icon}
              size={22}
              color={hasValues ? (isDark ? "#000" : "#fff") : colors.primary}
            />
          </View>
          <View style={styles.categoryTitleContainer}>
            <Text style={[styles.categoryTitle, hasValues && { color: colors.accent }]}>
              {title}
            </Text>
            <Text style={styles.categoryDescription}>{description}</Text>
          </View>
        </View>
        <View style={[styles.categoryToggle, hasValues && { borderColor: colors.primary }]}>
          <Ionicons
            name={isCollapsed ? "chevron-down" : "chevron-up"}
            size={20}
            color={hasValues ? colors.primary : "#64748B"}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderDetailsTab = () => {
    const hecsCompleted = hecsDebt;
    const medicareCompleted = medicareExemption || hasDependents;
    const completedCategories = [hecsCompleted, medicareCompleted].filter(Boolean).length;

    return (
      <View style={styles.tabContent}>
        <Text style={styles.sectionTitle}>Additional Details</Text>





        {/* HECS-HELP Debt Section */}
        <View style={styles.deductionCategory}>
          {renderDetailsCategoryHeader(
            'hecsDebt',
            'HECS-HELP Debt',
            'Student loan repayment obligations',
            'school-outline',
            hecsCompleted
          )}

          {!detailsCollapsedCategories.hecsDebt && (
            <View style={styles.categoryContent}>
              <TouchableOpacity
                style={[styles.toggleButton, hecsDebt && styles.toggleButtonActive]}
                onPress={() => setHecsDebt(!hecsDebt)}
              >
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons
                      name={hecsDebt ? "checkbox-outline" : "square-outline"}
                      size={24}
                      color={hecsDebt ? "#4A90E2" : "#666"}
                    />
                    <Text style={[styles.toggleText, hecsDebt && styles.toggleTextActive]}>
                      I have HECS-HELP debt
                    </Text>
                  </View>
                  <Text style={styles.toggleSubtext}>
                    HECS-HELP repayments are automatically calculated based on your taxable income. Repayment rates range from 1% to 10%, with a minimum threshold of $51,550 for 2024-25. Check your myGov account for your current debt balance.
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Medicare Levy Section */}
        <View style={styles.deductionCategory}>
          {renderDetailsCategoryHeader(
            'medicareLevy',
            'Medicare Levy',
            'Medicare levy exemptions and dependents',
            'medical-outline',
            medicareCompleted
          )}

          {!detailsCollapsedCategories.medicareLevy && (
            <View style={styles.categoryContent}>
              <TouchableOpacity
                style={[styles.toggleButton, medicareExemption && styles.toggleButtonActive]}
                onPress={() => setMedicareExemption(!medicareExemption)}
              >
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons
                      name={medicareExemption ? "checkbox-outline" : "square-outline"}
                      size={24}
                      color={medicareExemption ? "#4A90E2" : "#666"}
                    />
                    <Text style={[styles.toggleText, medicareExemption && styles.toggleTextActive]}>
                      I am exempt from Medicare Levy
                    </Text>
                  </View>
                  <Text style={styles.toggleSubtext}>
                    Tick this if you're a temporary visa holder, foreign resident, or Norfolk Island resident. Leave unticked if you're an Australian resident for tax purposes.
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.toggleButton, hasDependents && styles.toggleButtonActive]}
                onPress={() => {
                  setHasDependents(!hasDependents);
                  if (hasDependents) {
                    setDependents('0');
                  }
                }}
              >
                <Ionicons
                  name={hasDependents ? "checkbox-outline" : "square-outline"}
                  size={24}
                  color={hasDependents ? "#4A90E2" : "#666"}
                />
                <Text style={[styles.toggleText, hasDependents && styles.toggleTextActive]}>
                  I have dependents
                </Text>
              </TouchableOpacity>

              {hasDependents && (
                <InputField
                  label="Number of Dependents"
                  value={dependents}
                  onChangeText={setDependents}
                  placeholder="Number of children/dependents (e.g., 2)"
                  keyboardType="number-pad"
                  icon="people-outline"
                  helpKey="dependents"
                />
              )}
            </View>
          )}
        </View>

        {/* Important Information Warning Card */}
        <View style={styles.warningCard}>
          <Ionicons name="warning" size={20} color={theme.warning} />
          <Text style={styles.warningCardText}>
            This calculator uses 2024-25 tax rates and thresholds. Results are estimates only and should not replace professional tax advice.
          </Text>
        </View>

        {/* Ready to Calculate Label */}
        <View style={styles.readyToCalculateLabel}>
          <Ionicons name="checkmark-circle" size={16} color={theme.textSecondary} />
          <Text style={styles.readyToCalculateLabelText}>Ready to Calculate</Text>
        </View>

        {/* Calculate Button */}
        <View style={styles.stepButtonContainer}>
          <TouchableOpacity
            style={[styles.stepButtonCalculate, isCalculating && { opacity: 0.7 }]}
            onPress={estimateTax}
            disabled={isCalculating}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.stepButtonCalculateGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.stepButtonCalculateIconContainer}>
                <Ionicons name={isCalculating ? "hourglass-outline" : "calculator-outline"} size={20} color="#fff" />
              </View>
              <Text style={styles.stepButtonText}>{isCalculating ? 'Calculating...' : 'Calculate Tax Return'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

      </View>
    );
  };



  // Render compact table view component
  const renderCompactTableView = () => {
    if (!result) return null;

    const tableData = [
      ['Item', 'Amount'],
      ['TFN Employment Income', formatCurrency(result.totalTFNIncome)],
      ['ABN/Business Income', formatCurrency(result.abnIncomeNum)],
      ['Total Gross Income', formatCurrency(result.totalTFNIncome + result.abnIncomeNum)],
      ['Manual Deductions', formatCurrency(result.totalManualDeductions)],
      ['Work From Home Deduction', formatCurrency(result.workFromHomeDeduction)],
      ['Total Deductions', formatCurrency(result.totalDeductions)],
      ['Taxable Income', formatCurrency(result.taxableIncome)],
      ['Gross Tax', formatCurrency(result.tax)],
      ['LITO Offset', formatCurrency(result.lito)],
      ['Medicare Levy', formatCurrency(result.medicare)],
    ];

    // Add HECS repayment if applicable
    if (result.hecsRepayment > 0) {
      tableData.push(['HECS-HELP Repayment', formatCurrency(result.hecsRepayment)]);
    }

    // Add final calculations
    tableData.push(
      ['Tax Withheld (PAYG)', formatCurrency(parseFloat(taxWithheld || '0'))],
      [result.refund >= 0 ? 'Tax Refund' : 'Tax Owing', formatCurrency(Math.abs(result.refund))]
    );

    return (
      <View style={styles.compactTableContainer}>
        <View style={styles.compactTableContent}>
          {tableData.map((row, rowIndex) => (
            <View key={rowIndex} style={[
              styles.compactTableRow,
              rowIndex === 0 && styles.compactTableHeaderRow,
              rowIndex === tableData.length - 1 && styles.compactTableFinalRow
            ]}>
              {row.map((cell, cellIndex) => (
                <View key={cellIndex} style={[
                  styles.compactTableCell,
                  cellIndex === 0 ? styles.compactTableCellLabel : styles.compactTableCellValue
                ]}>
                  <Text style={[
                    styles.compactTableCellText,
                    rowIndex === 0 && styles.compactTableHeaderText,
                    rowIndex === tableData.length - 1 && styles.compactTableFinalText,
                    cellIndex === 1 && rowIndex > 0 && styles.compactTableValueText
                  ]}>
                    {cell}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderResults = () => {
    console.log('renderResults called - isCalculating:', isCalculating, 'result:', !!result);

    if (isCalculating) {
      return (
        <View style={styles.tabContent}>
          <View style={styles.loadingContainer}>
            <View style={styles.loadingCard}>
              <View style={styles.loadingIconContainer}>
                <Ionicons name="calculator" size={32} color={theme.primary} />
              </View>

              <Text style={styles.loadingTitle}>Processing Your Tax Return</Text>
              <Text style={styles.loadingSubtitle}>
                Our advanced algorithms are analyzing your financial data to provide accurate tax calculations
              </Text>

              <View style={styles.loadingProgressContainer}>
                <ActivityIndicator
                  size="small"
                  color={theme.primary}
                  style={styles.loadingSpinner}
                />
                <Text style={styles.loadingProgressText}>Calculating...</Text>
              </View>

              <View style={styles.loadingSteps}>
                {[
                  'Validating income sources',
                  'Processing deductions',
                  'Applying tax brackets & offsets',
                  'Generating comprehensive report'
                ].map((stepText, index) => {
                  const stepNumber = index + 1;
                  const isCompleted = loadingStep > stepNumber;
                  const isActive = loadingStep === stepNumber;

                  return (
                    <View key={stepNumber} style={styles.loadingStep}>
                      <View style={[
                        styles.loadingStepIcon,
                        isCompleted && styles.loadingStepIconActive
                      ]}>
                        {isCompleted ? (
                          <Ionicons name="checkmark" size={10} color="#fff" />
                        ) : isActive ? (
                          <ActivityIndicator size={8} color={theme.primary} />
                        ) : null}
                      </View>
                      <Text style={[
                        styles.loadingStepText,
                        (isCompleted || isActive) && styles.loadingStepTextActive
                      ]}>
                        {stepText}
                      </Text>
                    </View>
                  );
                })}
              </View>

              <View style={styles.loadingFooter}>
                <Text style={styles.loadingFooterText}>
                  Using 2024-25 ATO tax rates and thresholds{'\n'}
                  Calculations typically complete within 3-5 seconds
                </Text>
              </View>
            </View>
          </View>
        </View>
      );
    }

    if (!result) {
      return (
        <View style={styles.tabContent}>
          <Text style={[styles.sectionTitle, { textAlign: 'center', marginTop: 40 }]}>
            Complete the calculation in step 3 to view your tax estimation results
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.tabContent}>
        {/* Header with Table View Button */}
        <View style={styles.resultsHeaderContainer}>
          <Text style={styles.sectionTitle}>Tax Calculation Results</Text>
          <TouchableOpacity
            style={styles.tableViewButton}
            onPress={() => setResultsViewMode(resultsViewMode === 'table' ? 'card' : 'table')}
          >
            <Ionicons
              name={resultsViewMode === 'table' ? "grid-outline" : "list-outline"}
              size={20}
              color={theme.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Conditional View Rendering */}
        {resultsViewMode === 'card' ? (
          <>
            {/* Enhanced Results Summary */}
            <View style={styles.deductionSummary}>
          <View style={styles.summaryHeader}>
            <Ionicons name="checkmark-circle" size={20} color={theme.success} />
            <Text style={styles.summaryTitle}>Tax Estimation Complete</Text>
            <View style={styles.summaryBadge}>
              <Text style={styles.summaryBadgeText}>2024-25</Text>
            </View>
          </View>

          {/* Main Result Card */}
          <View style={[styles.resultMainCard, { backgroundColor: result.refund >= 0 ? theme.successLight : theme.errorLight }]}>
            <View style={styles.resultMainHeader}>
              <Ionicons
                name={result.refund >= 0 ? "trending-up" : "trending-down"}
                size={24}
                color={result.refund >= 0 ? theme.success : theme.error}
              />
              <Text style={[styles.resultMainLabel, { color: result.refund >= 0 ? theme.success : theme.error }]}>
                {result.refund >= 0 ? 'Estimated Refund' : 'Amount Owing'}
              </Text>
            </View>
            <Text style={[styles.resultMainAmount, { color: result.refund >= 0 ? theme.success : theme.error }]}>
              {formatCurrency(Math.abs(result.refund))}
            </Text>
            <Text style={styles.resultMainSubtext}>
              Effective Tax Rate: {result.effectiveTaxRate.toFixed(1)}%
            </Text>
            <Text style={styles.resultMainFinancialYear}>
              Financial Year 2024-25
            </Text>
          </View>
        </View>

        {/* Income Breakdown Section */}
        <View style={styles.deductionCategory}>
          <View style={[styles.deductionCategoryHeader, { backgroundColor: theme.primaryLight }]}>
            <View style={styles.categoryHeaderLeft}>
              <View style={[styles.categoryIcon, { backgroundColor: theme.primary }]}>
                <Ionicons name="wallet-outline" size={22} color={isDark ? "#000" : "#fff"} />
              </View>
              <View style={styles.categoryTitleContainer}>
                <Text style={[styles.categoryTitle, { color: theme.text }]}>Income Breakdown</Text>
                <Text style={styles.categoryDescription}>Total gross income from all sources</Text>
                <Text style={[styles.categoryTotal, { color: theme.text }]}>
                  Total: {formatCurrency(result.totalTFNIncome + result.abnIncomeNum)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.categoryContent}>
            <View style={styles.summaryBreakdown}>
              <View style={styles.summaryBreakdownItem}>
                <View style={[styles.summaryBreakdownDot, { backgroundColor: theme.primary }]} />
                <Text style={styles.summaryBreakdownLabel}>TFN Employment Income</Text>
                <Text style={styles.summaryBreakdownValue}>{formatCurrency(result.totalTFNIncome)}</Text>
              </View>
              <View style={styles.summaryBreakdownItem}>
                <View style={[styles.summaryBreakdownDot, { backgroundColor: theme.categoryEducation }]} />
                <Text style={styles.summaryBreakdownLabel}>ABN/Business Income</Text>
                <Text style={styles.summaryBreakdownValue}>{formatCurrency(result.abnIncomeNum)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Deductions Breakdown Section */}
        <View style={styles.deductionCategory}>
          <View style={[styles.deductionCategoryHeader, { backgroundColor: theme.successLight }]}>
            <View style={styles.categoryHeaderLeft}>
              <View style={[styles.categoryIcon, { backgroundColor: theme.success }]}>
                <Ionicons name="receipt-outline" size={22} color={isDark ? "#000" : "#fff"} />
              </View>
              <View style={styles.categoryTitleContainer}>
                <Text style={[styles.categoryTitle, { color: theme.success }]}>Deductions Breakdown</Text>
                <Text style={styles.categoryDescription}>Total allowable tax deductions claimed</Text>
                <Text style={[styles.categoryTotal, { color: theme.success }]}>
                  Total: -{formatCurrency(result.totalDeductions)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.categoryContent}>
            <View style={styles.summaryBreakdown}>
              <View style={styles.summaryBreakdownItem}>
                <View style={[styles.summaryBreakdownDot, { backgroundColor: theme.categoryDonations }]} />
                <Text style={styles.summaryBreakdownLabel}>Manual Deductions</Text>
                <Text style={styles.summaryBreakdownValue}>-{formatCurrency(result.totalManualDeductions)}</Text>
              </View>
              <View style={styles.summaryBreakdownItem}>
                <View style={[styles.summaryBreakdownDot, { backgroundColor: theme.categoryHome }]} />
                <Text style={styles.summaryBreakdownLabel}>Work From Home</Text>
                <Text style={styles.summaryBreakdownValue}>-{formatCurrency(result.workFromHomeDeduction)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tax Calculation Section */}
        <View style={styles.deductionCategory}>
          <View style={[styles.deductionCategoryHeader, { backgroundColor: theme.warningLight }]}>
            <View style={styles.categoryHeaderLeft}>
              <View style={[styles.categoryIcon, { backgroundColor: theme.warning }]}>
                <Ionicons name="calculator-outline" size={22} color={isDark ? "#000" : "#fff"} />
              </View>
              <View style={styles.categoryTitleContainer}>
                <Text style={[styles.categoryTitle, { color: theme.warning }]}>Tax Calculation</Text>
                <Text style={styles.categoryDescription}>Detailed breakdown of tax liability calculation</Text>
                <Text style={[styles.categoryTotal, { color: theme.warning }]}>
                  Final Tax: {formatCurrency(result.finalTax)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.categoryContent}>
            <View style={styles.summaryBreakdown}>
              <View style={styles.summaryBreakdownItem}>
                <View style={[styles.summaryBreakdownDot, { backgroundColor: theme.categoryOther }]} />
                <Text style={[styles.summaryBreakdownLabel, { fontWeight: '600' }]}>Taxable Income</Text>
                <Text style={[styles.summaryBreakdownValue, { fontWeight: '600' }]}>{formatCurrency(result.taxableIncome)}</Text>
              </View>
              <View style={styles.summaryBreakdownItem}>
                <View style={[styles.summaryBreakdownDot, { backgroundColor: theme.categoryDonations }]} />
                <Text style={styles.summaryBreakdownLabel}>Gross Tax</Text>
                <Text style={styles.summaryBreakdownValue}>{formatCurrency(result.tax)}</Text>
              </View>
              <View style={styles.summaryBreakdownItem}>
                <View style={[styles.summaryBreakdownDot, { backgroundColor: theme.success }]} />
                <Text style={styles.summaryBreakdownLabel}>LITO Offset</Text>
                <Text style={styles.summaryBreakdownValue}>-{formatCurrency(result.lito)}</Text>
              </View>
              <View style={styles.summaryBreakdownItem}>
                <View style={[styles.summaryBreakdownDot, { backgroundColor: theme.categoryHome }]} />
                <Text style={styles.summaryBreakdownLabel}>Medicare Levy</Text>
                <Text style={styles.summaryBreakdownValue}>+{formatCurrency(result.medicare)}</Text>
              </View>
              {result.hecsRepayment > 0 && (
                <View style={styles.summaryBreakdownItem}>
                  <View style={[styles.summaryBreakdownDot, { backgroundColor: theme.categoryOther }]} />
                  <Text style={styles.summaryBreakdownLabel}>HECS-HELP Repayment</Text>
                  <Text style={styles.summaryBreakdownValue}>+{formatCurrency(result.hecsRepayment)}</Text>
                </View>
              )}
            </View>

            {/* Tax Estimate */}
            <View style={[styles.taxSavingsEstimate, { backgroundColor: theme.warningLight, borderColor: theme.warning }]}>
              <Ionicons name="information-circle" size={16} color={theme.warning} />
              <Text style={[styles.taxSavingsText, { color: theme.warning }]}>
                Tax withheld: {formatCurrency(parseFloat(taxWithheld || '0'))} • Calculated using 2024-25 ATO rates
              </Text>
            </View>
          </View>
        </View>



        {/* Tips Section */}
        <View style={styles.nextStepsContainer}>
          <View style={styles.nextStepsHeader}>
            <Ionicons name="information-circle-outline" size={20} color={theme.primary} />
            <Text style={styles.nextStepsTitle}>Important Reminder</Text>
          </View>
          <View style={styles.nextStepsList}>
            <View style={styles.nextStepItem}>
              <Text style={styles.nextStepText}>Keep receipts and documentation for all claimed deductions</Text>
            </View>
          </View>
        </View>

            {/* Action Buttons Section - Only visible in card view */}
            <View style={styles.quickAddGrid}>
                <TouchableOpacity style={[styles.quickAddButton, { backgroundColor: theme.error }]} onPress={exportPDF}>
                  <Ionicons name="document-outline" size={20} color={isDark ? "#000" : "#fff"} />
                  <Text style={[styles.quickAddButtonText, { color: isDark ? "#000" : '#fff', marginTop: 8 }]}>Export PDF</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.quickAddButton, { backgroundColor: theme.success }]} onPress={exportCSV}>
                  <Ionicons name="download-outline" size={20} color={isDark ? "#000" : "#fff"} />
                  <Text style={[styles.quickAddButtonText, { color: isDark ? "#000" : '#fff', marginTop: 8 }]}>Export CSV</Text>
                </TouchableOpacity>

                {!viewingCalculation && (
                  <TouchableOpacity style={[styles.quickAddButton, { backgroundColor: theme.warning }]} onPress={handleSaveCalculation}>
                    <Ionicons name="bookmark-outline" size={20} color={isDark ? "#000" : "#fff"} />
                    <Text style={[styles.quickAddButtonText, { color: isDark ? "#000" : '#fff', marginTop: 8 }]}>Save Calculation</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[styles.quickAddButton, { backgroundColor: theme.categoryOther }]}
                  onPress={() => {
                    setCurrentStep(1);
                  }}
                >
                  <Ionicons name="create-outline" size={20} color={isDark ? "#000" : "#fff"} />
                  <Text style={[styles.quickAddButtonText, { color: isDark ? "#000" : '#fff', marginTop: 8 }]}>Edit Calculation</Text>
                </TouchableOpacity>
              </View>

            {/* ATO File Tax Return Button - Only in card view */}
            <Text style={styles.atoFileReturnDescription}>
              Ready to lodge? File your return with the ATO
            </Text>
            <TouchableOpacity
              style={styles.atoFileReturnButton}
              onPress={() => openExternalURL('https://www.ato.gov.au/individuals/mytax/')}
            >
              <Ionicons name="globe-outline" size={22} color="#ffffff" />
              <Text style={styles.atoFileReturnButtonText}>Visit ATO myTax Portal</Text>
              <Ionicons name="open-outline" size={16} color="#ffffff" style={styles.externalLinkIcon} />
            </TouchableOpacity>
          </>
        ) : (
          /* Compact Table View */
          renderCompactTableView()
        )}

        {/* Full Width Back to Home Button */}
        <TouchableOpacity
          style={styles.fullWidthHomeButton}
          onPress={navigateToHome}
        >
          <Ionicons name="home-outline" size={20} color={theme.primary} />
          <Text style={styles.fullWidthHomeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Render current step content
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderIncomeTab();
      case 2:
        return renderDeductionsTab();
      case 3:
        return renderDetailsTab();
      case 4:
        return renderResults();
      default:
        return renderIncomeTab();
    }
  };

  // Show splash screen while theme is loading or during initial splash
  if (themeLoading || showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  if (currentScreen === 'home') {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <HomeScreen
          onCreateNew={navigateToCalculator}
          onViewCalculation={viewCalculation}
          onNavigate={handleNavigation}
        />
      </View>
    );
  }

  if (currentScreen === 'about') {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <AboutScreen onBack={navigateToHome} />
      </View>
    );
  }

  // Calculator screen
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <StatusBar style="light" />

      {showSuccessAnimation && (
        <Animated.View style={[
          styles.successBanner,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          <Ionicons name="checkmark-circle" size={20} color="#fff" />
          <Text style={styles.successBannerText}>
            Tax calculation completed successfully!
          </Text>
        </Animated.View>
      )}

      <StepIndicator />

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            {renderCurrentStep()}
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>


    </KeyboardAvoidingView>
  );
}

// Main App component with theme provider
export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}