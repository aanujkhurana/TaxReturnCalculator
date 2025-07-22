import { useState, useEffect, useCallback, memo, useMemo } from 'react';
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
  Modal
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './HomeScreen';
import { saveCalculation } from './storage';

// Styles definition
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 24,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  headerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: 8,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },

  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  tabContent: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
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
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 12,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3748',
    marginLeft: 8,
    letterSpacing: 0.2,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  inputError: {
    borderColor: '#FF6B6B',
    borderWidth: 2,
    backgroundColor: '#FFF5F5',
  },
  inputDisabled: {
    backgroundColor: '#F7F8FA',
    borderColor: '#E2E8F0',
    color: '#64748B',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#FF6B6B',
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
    backgroundColor: '#EBF5FF',
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BEE3F8',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  addButtonText: {
    color: '#4A90E2',
    fontWeight: '600',
    marginLeft: 10,
    fontSize: 15,
    letterSpacing: 0.2,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  toggleButtonActive: {
    backgroundColor: '#F0F9FF',
    borderColor: '#4A90E2',
    shadowColor: '#4A90E2',
    shadowOpacity: 0.12,
  },
  toggleText: {
    fontSize: 16,
    color: '#64748B',
    marginLeft: 14,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  toggleTextActive: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  toggleSubtext: {
    fontSize: 13,
    color: '#9CA3AF',
    marginLeft: 38,
    marginTop: 4,
    lineHeight: 18,
  },
  wfhInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
    flex: 1,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f0f8ff',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  infoBoxText: {
    fontSize: 14,
    color: '#333',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 36,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    minWidth: 300,
    maxWidth: 340,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  loadingIconContainer: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 50,
    backgroundColor: '#f8f9ff',
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  loadingSubtitle: {
    fontSize: 15,
    color: '#666',
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
    color: '#4A90E2',
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
    backgroundColor: '#e8f4fd',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingStepIconActive: {
    backgroundColor: '#4A90E2',
  },
  loadingStepText: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  loadingStepTextActive: {
    color: '#4A90E2',
    fontWeight: '500',
  },
  loadingFooter: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    alignSelf: 'stretch',
  },
  loadingFooterText: {
    fontSize: 12,
    color: '#999',
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
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#fff',
    padding: 20,
  },
  summaryCards: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 100,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  summaryAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2D3748',
    textAlign: 'center',
    letterSpacing: 0.3,
    lineHeight: 26,
  },
  breakdownSection: {
    marginBottom: 24,
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  breakdownTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    letterSpacing: 0.3,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 2,
  },
  breakdownLabel: {
    fontSize: 15,
    color: '#64748B',
    flex: 1,
    letterSpacing: 0.2,
  },
  breakdownValue: {
    fontSize: 15,
    color: '#2D3748',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#333',
  },
  totalTaxItem: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
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
  // Step indicator styles
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: -15,
    borderRadius: 15,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  stepIndicatorRow: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F4F8',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  stepCircleActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#3A7BC2',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  stepCircleCurrent: {
    backgroundColor: '#357ABD',
    borderColor: '#2563A8',
    transform: [{ scale: 1.15 }],
    shadowColor: '#357ABD',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  stepCircleDisabled: {
    backgroundColor: '#f8f8f8',
    borderColor: '#e0e0e0',
    opacity: 0.5,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#999',
  },
  stepNumberActive: {
    color: '#fff',
  },
  stepNumberDisabled: {
    color: '#ccc',
  },
  stepLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  stepLabelActive: {
    color: '#4A90E2',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  stepLabelDisabled: {
    color: '#ccc',
    opacity: 0.6,
  },
  stepLine: {
    position: 'absolute',
    top: 16,
    left: '50%',
    right: '-50%',
    height: 2,
    backgroundColor: '#ddd',
    zIndex: -1,
  },
  stepLineActive: {
    backgroundColor: '#4A90E2',
  },
  // Bottom button container styles
  bottomButtonContainer: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20, // Extra padding for phone navigation area
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  // Navigation button styles
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 0,
    paddingHorizontal: 4,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#4A90E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  navButtonBack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#6B7280',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    minWidth: '30%',
    maxWidth: 120,
    height: 56,
  },
  navButtonCancel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#EF4444',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    minWidth: '30%',
    maxWidth: 120,
    height: 56,
  },
  navButtonPrimary: {
    backgroundColor: '#000000',
    borderColor: '#333333',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    minWidth: '40%',
    maxWidth: 160,
    paddingVertical: 16,
    paddingHorizontal: 32,
    height: 56,
  },
  navButtonCalculate: {
    backgroundColor: '#10B981',
    borderColor: '#059669',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    minWidth: '40%',
    maxWidth: 160,
    paddingVertical: 16,
    paddingHorizontal: 32,
    height: 56,
  },
  navButtonText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
    marginLeft: 8,
  },
  navButtonTextBack: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
    marginLeft: 8,
  },
  navButtonTextCancel: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
    marginLeft: 8,
  },
  navButtonTextPrimary: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  navButtonSpacer: {
    flex: 1,
  },
  startOverButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 1.5,
    borderColor: '#4A90E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    height: 48,
  },
  startOverButtonText: {
    fontSize: 16,
    color: '#4A90E2',
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
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4A90E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    height: 48,
  },
  homeButtonText: {
    fontSize: 16,
    color: '#4A90E2',
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
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4A90E2',
    shadowColor: '#000',
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
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4A90E2',
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
    color: '#4A90E2',
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
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    maxWidth: '100%',
    width: '100%',
    maxHeight: '80%',
    elevation: 10,
    shadowColor: '#000',
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
    borderBottomColor: '#E2E8F0',
  },
  helpModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
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
    color: '#4A90E2',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  helpSectionText: {
    fontSize: 15,
    color: '#4A5568',
    lineHeight: 22,
    marginBottom: 8,
  },
  helpExamplesList: {
    marginLeft: 12,
  },
  helpExampleItem: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 4,
    lineHeight: 20,
  },
  helpTipsList: {
    marginLeft: 12,
  },
  helpTipItem: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 6,
    lineHeight: 20,
  },
  helpWhereToFind: {
    backgroundColor: '#F7FAFC',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#4A90E2',
  },
  helpWhereToFindText: {
    fontSize: 14,
    color: '#2D3748',
    fontStyle: 'italic',
    lineHeight: 20,
  },

  // Deduction category styles
  deductionCategory: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },

  categoryDescription: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 16,
    lineHeight: 20,
  },

  // Collapsible category styles
  deductionCategoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },

  deductionCategoryHeaderCollapsed: {
    borderBottomWidth: 0,
    borderRadius: 12,
  },

  categoryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EBF5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  categoryIconActive: {
    backgroundColor: '#4A90E2',
  },

  categoryTitleContainer: {
    flex: 1,
  },

  categoryToggle: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  categoryContent: {
    padding: 20,
    paddingTop: 16,
  },

  categoryTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90E2',
    marginTop: 4,
  },
});

// Help Modal Component
const HelpModal = ({ visible, onClose, helpData }) => {
  if (!helpData) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.helpModalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          style={styles.helpModalContent}
          activeOpacity={1}
          onPress={() => {}} // Prevent modal close when tapping content
        >
          <View style={styles.helpModalHeader}>
            <Text style={styles.helpModalTitle}>{helpData.title}</Text>
            <TouchableOpacity
              style={styles.helpModalCloseButton}
              onPress={onClose}
            >
              <Ionicons name="close" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.helpModalScrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.helpSection}>
              <Text style={styles.helpSectionTitle}>Purpose</Text>
              <Text style={styles.helpSectionText}>{helpData.purpose}</Text>
            </View>

            {helpData.examples && helpData.examples.length > 0 && (
              <View style={styles.helpSection}>
                <Text style={styles.helpSectionTitle}>Examples</Text>
                <View style={styles.helpExamplesList}>
                  {helpData.examples.map((example, index) => (
                    <Text key={index} style={styles.helpExampleItem}>
                      • {example}
                    </Text>
                  ))}
                </View>
              </View>
            )}

            {helpData.tips && helpData.tips.length > 0 && (
              <View style={styles.helpSection}>
                <Text style={styles.helpSectionTitle}>Tips</Text>
                <View style={styles.helpTipsList}>
                  {helpData.tips.map((tip, index) => (
                    <Text key={index} style={styles.helpTipItem}>
                      • {tip}
                    </Text>
                  ))}
                </View>
              </View>
            )}

            {helpData.whereToFind && (
              <View style={styles.helpSection}>
                <Text style={styles.helpSectionTitle}>Where to Find</Text>
                <View style={styles.helpWhereToFind}>
                  <Text style={styles.helpWhereToFindText}>{helpData.whereToFind}</Text>
                </View>
              </View>
            )}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

// Memoized InputField component to prevent unnecessary re-renders
const InputField = memo(({ label, value, onChangeText, placeholder, keyboardType = 'numeric', multiline = false, icon, helpKey, error, editable = true, prefix = '', suffix = '' }) => {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const helpData = helpKey ? HELP_TEXT[helpKey] : null;

  // Format display value with prefix and suffix
  const getDisplayValue = (val) => {
    if (!val) return '';
    return `${prefix}${val}${suffix}`;
  };

  // Extract raw value from display value (remove prefix and suffix)
  const getRawValue = (displayVal) => {
    if (!displayVal) return '';
    let rawVal = displayVal;
    if (prefix && rawVal.startsWith(prefix)) {
      rawVal = rawVal.substring(prefix.length);
    }
    if (suffix && rawVal.endsWith(suffix)) {
      rawVal = rawVal.substring(0, rawVal.length - suffix.length);
    }
    return rawVal;
  };

  // Filter input for numeric fields to only allow numbers and decimal point
  const handleTextChange = (text) => {
    // First extract the raw value without prefix/suffix
    const rawText = getRawValue(text);

    if (keyboardType === 'numeric') {
      // Allow only numbers, decimal point, and handle empty string
      const filteredText = rawText.replace(/[^0-9.]/g, '');

      // Ensure only one decimal point
      const parts = filteredText.split('.');
      if (parts.length > 2) {
        const filtered = parts[0] + '.' + parts.slice(1).join('');
        onChangeText(filtered);
      } else {
        onChangeText(filteredText);
      }
    } else if (keyboardType === 'number-pad') {
      // For integer-only fields, allow only numbers
      const filteredText = rawText.replace(/[^0-9]/g, '');
      onChangeText(filteredText);
    } else {
      onChangeText(rawText);
    }
  };

  return (
    <>
      <View style={styles.inputContainer}>
        <View style={styles.labelContainer}>
          <Ionicons name={icon} size={18} color={error ? "#FF6B6B" : "#4A90E2"} />
          <Text style={[styles.inputLabel, error && { color: '#FF6B6B' }]}>{label}</Text>
          <TouchableOpacity
            style={helpData ? styles.helpIconWithData : styles.helpIcon}
            onPress={() => {
              if (helpData) {
                setShowHelpModal(true);
              } else {
                Alert.alert(label, placeholder);
              }
            }}
          >
            <Ionicons
              name={helpData ? "help-circle" : "help-circle-outline"}
              size={18}
              color={helpData ? "#4A90E2" : "#64748B"}
            />
          </TouchableOpacity>
        </View>
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            error && styles.inputError,
            !editable && styles.inputDisabled
          ]}
          value={getDisplayValue(value)}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          keyboardType={keyboardType}
          multiline={multiline}
          placeholderTextColor={!editable ? "#A0AEC0" : "#999"}
          returnKeyType="done"
          editable={editable}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      <HelpModal
        visible={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        helpData={helpData}
      />
    </>
  );
});

InputField.displayName = 'InputField';

// Comprehensive help text data for all input fields
const HELP_TEXT = {
  jobIncome: {
    title: "Employment Income (TFN Jobs)",
    purpose: "Enter your gross annual salary or wages from employment where tax was withheld using your Tax File Number (TFN).",
    examples: [
      "Full-time salary: 75000",
      "Part-time wages: 35000",
      "Multiple jobs: Add each separately"
    ],
    tips: [
      "Use your gross income before tax, not your take-home pay",
      "Find this amount on your payment summary or PAYG summary",
      "Include bonuses, overtime, and allowances",
      "Don't include super contributions or salary sacrifice amounts"
    ],
    whereToFind: "Check your payment summary, payslips, or PAYG summary from your employer"
  },
  abnIncome: {
    title: "ABN/Freelance Income",
    purpose: "Enter your total income from self-employment, contracting, or business activities using your Australian Business Number (ABN).",
    examples: [
      "Freelance consulting: 18000",
      "Uber/delivery driving: 12000",
      "Small business revenue: 45000"
    ],
    tips: [
      "Enter gross income before business expenses",
      "Include all ABN income from the financial year",
      "Business expenses will be calculated separately",
      "If you have multiple ABNs, combine the total income"
    ],
    whereToFind: "Check your business records, invoices, or BAS statements"
  },
  taxWithheld: {
    title: "Tax Withheld (PAYG)",
    purpose: "Enter the total amount of tax that was withheld from your pay during the financial year.",
    examples: [
      "Single job PAYG: 12500",
      "Multiple jobs total: 18750",
      "Including extra withholding: 16200"
    ],
    tips: [
      "Add up tax withheld from all your jobs",
      "Include any extra tax you asked to be withheld",
      "Don't include super contributions or other deductions",
      "This reduces your final tax bill"
    ],
    whereToFind: "Found on your payment summary, payslips, or in your myGov account"
  },
  workRelated: {
    title: "Work-Related Expenses",
    purpose: "Enter the total amount you spent on items required for your work that weren't reimbursed by your employer.",
    examples: [
      "Tools and equipment: 800",
      "Work uniforms: 300",
      "Professional development: 1200"
    ],
    tips: [
      "Only include expenses directly related to earning your income",
      "Keep receipts as evidence for the ATO",
      "Don't include travel between home and work",
      "Clothing must be specific uniforms or protective gear"
    ],
    whereToFind: "Review your receipts and records for work-related purchases"
  },
  selfEducation: {
    title: "Self-Education Expenses",
    purpose: "Enter costs for courses, training, or education that directly relates to your current job or increases your income-earning ability.",
    examples: [
      "Professional course: 1200",
      "Work-related books: 150",
      "Conference attendance: 800"
    ],
    tips: [
      "Education must relate to your current work",
      "Include course fees, textbooks, and travel to study",
      "Don't include meals or accommodation",
      "Keep all receipts and course documentation"
    ],
    whereToFind: "Check receipts for courses, books, and educational materials"
  },
  donations: {
    title: "Charitable Donations",
    purpose: "Enter the total amount of tax-deductible donations you made to registered charities.",
    examples: [
      "Regular charity donations: 500",
      "Disaster relief fund: 200",
      "Religious organization: 300"
    ],
    tips: [
      "Only donations to DGR (Deductible Gift Recipient) organizations qualify",
      "Donations over $2 require receipts",
      "Don't include raffle tickets or fundraising purchases",
      "Check the charity's DGR status on the ATO website"
    ],
    whereToFind: "Review your donation receipts and bank statements"
  },
  otherDeductions: {
    title: "Other Deductions",
    purpose: "Enter other allowable tax deductions such as investment expenses, tax agent fees, or income protection insurance.",
    examples: [
      "Tax agent fees: 300",
      "Investment property expenses: 1200",
      "Income protection insurance: 450"
    ],
    tips: [
      "Only include expenses directly related to earning income",
      "Investment expenses must relate to taxable investments",
      "Keep detailed records and receipts",
      "When in doubt, consult a tax professional"
    ],
    whereToFind: "Review receipts for professional services and investment-related expenses"
  },
  workFromHome: {
    title: "Work From Home Hours",
    purpose: "Enter the total number of hours you worked from home during the financial year using the ATO shortcut method.",
    examples: [
      "2 days per week: ~400 hours",
      "Full-time remote: ~1800 hours",
      "Occasional WFH: ~100 hours"
    ],
    tips: [
      "ATO shortcut method: $0.67 per hour (max $1,000)",
      "Keep a diary or log of work from home hours",
      "Must be for employment duties, not personal use",
      "Alternative: claim actual expenses with detailed records"
    ],
    whereToFind: "Calculate from your work diary, calendar, or employment records"
  },
  dependents: {
    title: "Number of Dependents",
    purpose: "Enter the number of dependent children or other dependents that may affect your tax offsets and Medicare levy.",
    examples: [
      "Two children under 18: 2",
      "One child + elderly parent: 2",
      "No dependents: 0"
    ],
    tips: [
      "Include children under 18 or full-time students under 25",
      "Include other dependents you financially support",
      "May affect Medicare levy surcharge thresholds",
      "Can increase your tax-free threshold"
    ],
    whereToFind: "Count your dependent children and other dependents you financially support"
  },

  // Work-Related Deduction Subcategories
  workRelatedTravel: {
    title: "Work-Related Travel Expenses",
    purpose: "Enter costs for travel directly related to your work, excluding normal commuting between home and work.",
    examples: [
      "Travel between work sites: 450",
      "Client visits: 320",
      "Work conferences travel: 800"
    ],
    tips: [
      "Don't include travel between home and regular workplace",
      "Include car expenses, public transport, flights for work",
      "Keep detailed logbooks for car travel",
      "Must be directly related to earning income"
    ],
    whereToFind: "Review travel receipts, logbooks, and work-related trip records"
  },

  workRelatedEquipment: {
    title: "Work Equipment & Tools",
    purpose: "Enter costs for tools, equipment, and technology required for your work that weren't provided by your employer.",
    examples: [
      "Professional tools: 600",
      "Computer equipment: 1200",
      "Safety equipment: 300"
    ],
    tips: [
      "Only include items used primarily for work",
      "Equipment over $300 may need to be depreciated",
      "Don't include items provided by employer",
      "Keep purchase receipts and warranty information"
    ],
    whereToFind: "Check receipts for work tools, equipment, and technology purchases"
  },

  workRelatedUniforms: {
    title: "Uniforms & Protective Clothing",
    purpose: "Enter costs for compulsory work uniforms, protective clothing, and occupation-specific clothing.",
    examples: [
      "Company uniform: 250",
      "Safety boots and gear: 180",
      "Professional attire: 400"
    ],
    tips: [
      "Must be compulsory uniform or protective clothing",
      "Include cleaning and maintenance costs",
      "Regular business attire usually not deductible",
      "Logo or company-specific clothing qualifies"
    ],
    whereToFind: "Review receipts for uniforms, safety gear, and work-specific clothing"
  },

  workRelatedMemberships: {
    title: "Professional Memberships & Subscriptions",
    purpose: "Enter costs for professional memberships, union fees, and work-related subscriptions.",
    examples: [
      "Professional association: 350",
      "Union membership: 200",
      "Industry publications: 120"
    ],
    tips: [
      "Must be directly related to your work",
      "Include professional body memberships",
      "Union fees are generally deductible",
      "Trade magazines and journals qualify"
    ],
    whereToFind: "Check bank statements for membership fees and subscription payments"
  },

  // Self-Education Deduction Subcategories
  selfEducationCourseFees: {
    title: "Course Fees & Tuition",
    purpose: "Enter tuition fees for courses, training programs, and educational qualifications directly related to your current work.",
    examples: [
      "Professional certification course: 1500",
      "Skills training program: 800",
      "University subject: 1200"
    ],
    tips: [
      "Course must relate to your current job",
      "Include tuition fees and compulsory course materials",
      "Don't include HECS-HELP payments",
      "Keep course enrollment and payment receipts"
    ],
    whereToFind: "Review education provider invoices and payment confirmations"
  },

  selfEducationTextbooks: {
    title: "Textbooks & Learning Materials",
    purpose: "Enter costs for textbooks, study materials, and educational resources required for work-related study.",
    examples: [
      "Required textbooks: 300",
      "Study guides: 150",
      "Online learning materials: 200"
    ],
    tips: [
      "Must be required for your course or work",
      "Include digital and physical materials",
      "Keep receipts for all purchases",
      "Materials must relate to income-earning activities"
    ],
    whereToFind: "Check receipts from bookstores and online educational platforms"
  },

  selfEducationConferences: {
    title: "Conferences & Seminars",
    purpose: "Enter registration fees for work-related conferences, seminars, workshops, and professional development events.",
    examples: [
      "Industry conference: 600",
      "Professional workshop: 350",
      "Seminar registration: 200"
    ],
    tips: [
      "Must be directly related to your work",
      "Include registration fees only (not travel/accommodation)",
      "Keep registration confirmations and receipts",
      "Networking events may qualify if work-related"
    ],
    whereToFind: "Review conference registration emails and payment receipts"
  },

  selfEducationCertifications: {
    title: "Professional Certifications",
    purpose: "Enter costs for obtaining and maintaining professional certifications, licenses, and qualifications required for your work.",
    examples: [
      "Professional license renewal: 400",
      "Certification exam fees: 250",
      "Continuing education credits: 300"
    ],
    tips: [
      "Must be required for your profession",
      "Include exam fees and renewal costs",
      "Continuing education requirements qualify",
      "Keep certification documentation"
    ],
    whereToFind: "Check professional body statements and certification receipts"
  },

  // Donations Deduction Subcategories
  donationsCharitable: {
    title: "Charitable Donations",
    purpose: "Enter donations to registered charities and deductible gift recipients (DGR) for charitable purposes.",
    examples: [
      "Cancer research donation: 200",
      "Homeless shelter donation: 150",
      "Environmental charity: 300"
    ],
    tips: [
      "Charity must have DGR status",
      "Donations over $2 require receipts",
      "Check DGR status on ATO website",
      "Don't include raffle tickets or purchases"
    ],
    whereToFind: "Review donation receipts and bank statements for charitable giving"
  },

  donationsDisasterRelief: {
    title: "Disaster Relief Donations",
    purpose: "Enter donations to approved disaster relief funds and emergency appeal organizations.",
    examples: [
      "Bushfire relief fund: 500",
      "Flood appeal donation: 250",
      "Emergency relief charity: 300"
    ],
    tips: [
      "Must be to approved disaster relief funds",
      "Check ATO list of approved funds",
      "Keep donation receipts and confirmations",
      "Some government appeals may qualify"
    ],
    whereToFind: "Check receipts from disaster relief organizations and emergency appeals"
  },

  donationsReligious: {
    title: "Religious Organization Donations",
    purpose: "Enter donations to religious organizations that have deductible gift recipient status.",
    examples: [
      "Church building fund: 400",
      "Religious charity: 200",
      "Faith-based welfare: 300"
    ],
    tips: [
      "Organization must have DGR status",
      "Not all religious donations are deductible",
      "Building funds often qualify",
      "Verify DGR status with the organization"
    ],
    whereToFind: "Review religious organization receipts and donation statements"
  },

  // Other Deductions Subcategories
  otherInvestment: {
    title: "Investment Expenses",
    purpose: "Enter expenses related to managing your taxable investments, including property and share investments.",
    examples: [
      "Investment property expenses: 1200",
      "Share trading platform fees: 150",
      "Investment advice fees: 500"
    ],
    tips: [
      "Must relate to taxable investments only",
      "Include property management and maintenance",
      "Investment advice fees are deductible",
      "Don't include expenses for tax-free investments"
    ],
    whereToFind: "Review investment statements and property expense receipts"
  },

  otherTaxAgent: {
    title: "Tax Agent & Accounting Fees",
    purpose: "Enter fees paid to tax agents, accountants, and other professionals for tax-related services.",
    examples: [
      "Tax agent fee: 350",
      "Accounting services: 500",
      "Tax advice consultation: 200"
    ],
    tips: [
      "Must be for tax-related services only",
      "Include tax return preparation fees",
      "Tax advice and planning fees qualify",
      "Keep invoices and payment receipts"
    ],
    whereToFind: "Check invoices from tax agents and accounting professionals"
  },

  otherIncomeProtection: {
    title: "Income Protection Insurance",
    purpose: "Enter premiums paid for income protection insurance that covers loss of income due to illness or injury.",
    examples: [
      "Income protection premium: 800",
      "Salary continuance insurance: 600",
      "Professional indemnity: 400"
    ],
    tips: [
      "Must be income protection insurance specifically",
      "Life insurance premiums are not deductible",
      "Professional indemnity may qualify",
      "Keep insurance policy documents and receipts"
    ],
    whereToFind: "Review insurance policy statements and premium receipts"
  },

  otherBankFees: {
    title: "Bank Fees & Investment Charges",
    purpose: "Enter bank fees and charges directly related to earning investment income or managing taxable investments.",
    examples: [
      "Investment account fees: 120",
      "Share trading fees: 200",
      "Investment loan fees: 300"
    ],
    tips: [
      "Must be related to earning taxable income",
      "Investment account fees qualify",
      "Personal banking fees don't qualify",
      "Keep bank statements showing fees"
    ],
    whereToFind: "Review bank and investment account statements for fees"
  }
};

export default function App() {
  // Navigation state
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home' or 'calculator'
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

  // PAYG estimation feature
  const [paygUnknown, setPaygUnknown] = useState(false);
  const [estimatedPayg, setEstimatedPayg] = useState('');
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

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

  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);
  const loadingPulseAnim = new Animated.Value(1);
  const headerScaleAnim = new Animated.Value(0.95);
  const headerOpacityAnim = new Animated.Value(0);

  // Navigation functions
  const navigateToCalculator = () => {
    setCurrentScreen('calculator');
    resetForm();
  };

  const navigateToHome = () => {
    setCurrentScreen('home');
    setViewingCalculation(null);
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
    setResult(calculation.result);
    setCurrentStep(4); // Go directly to results
    setCurrentScreen('calculator');
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

  // Calculate estimated PAYG withholding based on total income
  const calculateEstimatedPayg = useCallback(() => {
    const parsedJobIncomes = jobIncomes.map((val) => parseFloat(val || '0'));
    const totalTFNIncome = parsedJobIncomes.reduce((sum, curr) => sum + (isNaN(curr) ? 0 : curr), 0);
    const abnIncomeNum = parseFloat(abnIncome || '0');
    const totalIncome = totalTFNIncome + abnIncomeNum;

    if (totalIncome <= 0) {
      return '0';
    }

    // Use a simplified withholding estimation based on income brackets
    // This approximates what employers typically withhold
    let estimatedWithholding = 0;

    if (totalIncome <= 18200) {
      // Tax-free threshold
      estimatedWithholding = 0;
    } else if (totalIncome <= 45000) {
      // 19% bracket - typically withhold around 15-20% due to tax-free threshold
      estimatedWithholding = (totalIncome - 18200) * 0.17;
    } else if (totalIncome <= 120000) {
      // 32.5% bracket - withhold around 25-30%
      const baseTax = (45000 - 18200) * 0.17;
      estimatedWithholding = baseTax + (totalIncome - 45000) * 0.28;
    } else if (totalIncome <= 180000) {
      // 37% bracket - withhold around 32-35%
      const baseTax = (45000 - 18200) * 0.17 + (120000 - 45000) * 0.28;
      estimatedWithholding = baseTax + (totalIncome - 120000) * 0.34;
    } else {
      // 45% bracket - withhold around 40-42%
      const baseTax = (45000 - 18200) * 0.17 + (120000 - 45000) * 0.28 + (180000 - 120000) * 0.34;
      estimatedWithholding = baseTax + (totalIncome - 180000) * 0.42;
    }

    // Add Medicare levy estimation (2% of taxable income)
    if (totalIncome > 27222) { // Medicare levy threshold for 2024-25
      estimatedWithholding += totalIncome * 0.02;
    }

    return Math.round(estimatedWithholding).toString();
  }, [jobIncomes, abnIncome]);

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

  // Update estimated PAYG when income values change and estimation is enabled
  useEffect(() => {
    if (paygUnknown) {
      const estimated = calculateEstimatedPayg();
      setEstimatedPayg(estimated);
      setTaxWithheld(estimated);
    }
  }, [paygUnknown, jobIncomes, abnIncome, calculateEstimatedPayg]);

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
      return newIncomes;
    });
    // Clear error for this field when user starts typing
    clearFieldError(`jobIncome_${index}`);
  }, []);

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

  // Step navigation functions
  const nextStep = useCallback(() => {
    console.log('Next step clicked. Current values:', { jobIncomes, abnIncome, taxWithheld });
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  }, [totalSteps, validateCurrentStep, jobIncomes, abnIncome, taxWithheld]);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

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
    const dependentsNum = parseInt(dependents || '0');

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

      // Hide success animation after 3 seconds
      setTimeout(() => {
        setShowSuccessAnimation(false);
      }, 3000);
    }, 2400); // Complete after all loading steps
  }, [jobIncomes, abnIncome, taxWithheld, deductions, workFromHomeHours, hecsDebt, medicareExemption, dependents]);



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

  // Step Progress Indicator Component
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
    );
  };



  // Navigation Buttons Component
  const NavigationButtons = () => (
    <View style={styles.navigationButtons}>
      {currentStep === 1 && (
        <TouchableOpacity style={styles.navButtonCancel} onPress={navigateToHome}>
          <Ionicons name="close" size={18} color="#EF4444" />
          <Text style={styles.navButtonTextCancel}>Cancel</Text>
        </TouchableOpacity>
      )}

      {currentStep > 1 && (
        <TouchableOpacity style={styles.navButtonBack} onPress={prevStep}>
          <Ionicons name="chevron-back" size={18} color="#6B7280" />
          <Text style={styles.navButtonTextBack}>Back</Text>
        </TouchableOpacity>
      )}

      <View style={styles.navButtonSpacer} />

      {currentStep < 3 && (
        <TouchableOpacity style={[styles.navButton, styles.navButtonPrimary]} onPress={nextStep}>
          <Text style={styles.navButtonTextPrimary}>Next</Text>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>
      )}

      {currentStep === 3 && (
        <TouchableOpacity
          style={[styles.navButton, styles.navButtonCalculate, isCalculating && { opacity: 0.7 }]}
          onPress={estimateTax}
          disabled={isCalculating}
        >
          <Ionicons name={isCalculating ? "hourglass-outline" : "calculator-outline"} size={20} color="#fff" />
          <Text style={styles.navButtonTextPrimary}>{isCalculating ? 'Calculating...' : 'Calculate'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );



  const renderIncomeTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Employment Income (TFN Jobs)</Text>
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
              <Ionicons name="close-circle" size={24} color="#FF6B6B" />
            </TouchableOpacity>
          )}
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={addJobIncomeField}>
        <Ionicons name="add-circle-outline" size={20} color="#4A90E2" />
        <Text style={styles.addButtonText}>Add Another Job</Text>
      </TouchableOpacity>

      <InputField
        label="ABN/Freelance Income"
        value={abnIncome}
        onChangeText={(value) => {
          setAbnIncome(value);
          clearFieldError('abnIncome');
        }}
        placeholder="Self-employed income (e.g., 15000)"
        icon="business-outline"
        helpKey="abnIncome"
        error={validationErrors.abnIncome}
        prefix="$"
      />

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
          color={paygUnknown ? "#4A90E2" : "#666"}
        />
        <Text style={[styles.toggleText, paygUnknown && styles.toggleTextActive]}>
          I don't know my PAYG withholding amount
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Helper function to calculate category totals
  const calculateCategoryTotal = (categoryData) => {
    return Object.values(categoryData).reduce((sum, value) => {
      const num = parseFloat(value || '0');
      return sum + (isNaN(num) ? 0 : num);
    }, 0);
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

  // Render collapsible category header
  const renderCategoryHeader = (categoryKey, title, description, icon, total) => {
    const isCollapsed = collapsedCategories[categoryKey];
    const hasValues = categoryHasValues(deductions[categoryKey] || {});

    return (
      <TouchableOpacity
        style={[
          styles.deductionCategoryHeader,
          isCollapsed && styles.deductionCategoryHeaderCollapsed
        ]}
        onPress={() => toggleCategory(categoryKey)}
        activeOpacity={0.7}
      >
        <View style={styles.categoryHeaderLeft}>
          <View style={[styles.categoryIcon, hasValues && styles.categoryIconActive]}>
            <Ionicons
              name={icon}
              size={20}
              color={hasValues ? "#fff" : "#4A90E2"}
            />
          </View>
          <View style={styles.categoryTitleContainer}>
            <Text style={styles.categoryTitle}>{title}</Text>
            <Text style={styles.categoryDescription}>{description}</Text>
            {total > 0 && (
              <Text style={styles.categoryTotal}>Total: {formatCurrency(total)}</Text>
            )}
          </View>
        </View>
        <View style={styles.categoryToggle}>
          <Ionicons
            name={isCollapsed ? "chevron-down" : "chevron-up"}
            size={20}
            color="#64748B"
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
    </View>
  );
  };

  const renderDetailsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Additional Details</Text>
      
      <TouchableOpacity
        style={[styles.toggleButton, hecsDebt && styles.toggleButtonActive]}
        onPress={() => setHecsDebt(!hecsDebt)}
      >
        <Ionicons 
          name={hecsDebt ? "checkbox-outline" : "square-outline"} 
          size={24} 
          color={hecsDebt ? "#4A90E2" : "#666"} 
        />
        <Text style={[styles.toggleText, hecsDebt && styles.toggleTextActive]}>
          I have HECS-HELP debt
        </Text>
      </TouchableOpacity>

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

      <InputField
        label="Number of Dependents"
        value={dependents}
        onChangeText={setDependents}
        placeholder="Number of children/dependents (e.g., 2)"
        keyboardType="number-pad"
        icon="people-outline"
        helpKey="dependents"
      />

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={20} color="#4A90E2" />
        <Text style={styles.infoBoxText}>
          This calculator uses 2024-25 tax rates and thresholds. Results are estimates only and should not replace professional tax advice.
        </Text>
      </View>
    </View>
  );

  const renderResults = () => {
    console.log('renderResults called - isCalculating:', isCalculating, 'result:', !!result);

    if (isCalculating) {
      return (
        <View style={styles.tabContent}>
          <View style={styles.loadingContainer}>
            <View style={styles.loadingCard}>
              <View style={styles.loadingIconContainer}>
                <Ionicons name="calculator" size={32} color="#4A90E2" />
              </View>

              <Text style={styles.loadingTitle}>Processing Your Tax Return</Text>
              <Text style={styles.loadingSubtitle}>
                Our advanced algorithms are analyzing your financial data to provide accurate tax calculations
              </Text>

              <View style={styles.loadingProgressContainer}>
                <ActivityIndicator
                  size="small"
                  color="#4A90E2"
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
                          <ActivityIndicator size={8} color="#4A90E2" />
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
          <View style={styles.loadingContainer}>
            <View style={styles.loadingCard}>
              <View style={styles.loadingIconContainer}>
                <Ionicons name="document-text-outline" size={32} color="#4A90E2" />
              </View>

              <Text style={styles.loadingTitle}>Ready to Calculate</Text>
              <Text style={styles.loadingSubtitle}>
                Complete your tax information in the previous steps to generate your comprehensive tax estimation report
              </Text>

              <TouchableOpacity
                style={[styles.navButton, styles.navButtonCalculate, { marginTop: 16 }]}
                onPress={() => setCurrentStep(3)}
              >
                <Ionicons name="chevron-back" size={20} color="#fff" />
                <Text style={styles.navButtonTextPrimary}>Complete Calculation</Text>
              </TouchableOpacity>

              <View style={styles.loadingFooter}>
                <Text style={styles.loadingFooterText}>
                  Ensure all income sources and deductions are entered{'\n'}
                  for the most accurate tax estimation
                </Text>
              </View>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.tabContent}>
        <View style={styles.resultContainer}>
        <LinearGradient
          colors={['#4A90E2', '#357ABD']}
          style={styles.resultHeader}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="checkmark-circle" size={24} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.resultTitle}>Tax Estimation Complete</Text>
          </View>
          <Text style={styles.resultSubtitle}>
            Financial Year 2024-25 • Calculated using current ATO rates
          </Text>
        </LinearGradient>

        <View style={styles.resultContent}>
          <View style={styles.summaryCards}>
            <View style={[styles.summaryCard, { backgroundColor: result.refund >= 0 ? '#E8F5E8' : '#FFF0F0' }]}>
              <Text style={styles.summaryLabel}>
                {result.refund >= 0 ? 'Estimated Refund' : 'Amount Owing'}
              </Text>
              <Text style={[styles.summaryAmount, { color: result.refund >= 0 ? '#2E7D2E' : '#D63384' }]}>
                {formatCurrency(Math.abs(result.refund))}
              </Text>
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Effective Tax Rate</Text>
              <Text style={styles.summaryAmount}>{result.effectiveTaxRate.toFixed(1)}%</Text>
            </View>
          </View>

          <View style={styles.breakdownSection}>
            <Text style={styles.breakdownTitle}>Income Breakdown</Text>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>TFN Employment Income</Text>
              <Text style={styles.breakdownValue}>{formatCurrency(result.totalTFNIncome)}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>ABN/Business Income</Text>
              <Text style={styles.breakdownValue}>{formatCurrency(result.abnIncomeNum)}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Total Gross Income</Text>
              <Text style={[styles.breakdownValue, styles.boldText]}>{formatCurrency(result.totalTFNIncome + result.abnIncomeNum)}</Text>
            </View>
          </View>

          <View style={styles.breakdownSection}>
            <Text style={styles.breakdownTitle}>Deductions</Text>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Manual Deductions</Text>
              <Text style={styles.breakdownValue}>-{formatCurrency(result.totalManualDeductions)}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Work From Home</Text>
              <Text style={styles.breakdownValue}>-{formatCurrency(result.workFromHomeDeduction)}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Total Deductions</Text>
              <Text style={[styles.breakdownValue, styles.boldText]}>-{formatCurrency(result.totalDeductions)}</Text>
            </View>
          </View>

          <View style={styles.breakdownSection}>
            <Text style={styles.breakdownTitle}>Tax Calculation</Text>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Taxable Income</Text>
              <Text style={[styles.breakdownValue, styles.boldText]}>{formatCurrency(result.taxableIncome)}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Gross Tax</Text>
              <Text style={styles.breakdownValue}>{formatCurrency(result.tax)}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>LITO Offset</Text>
              <Text style={styles.breakdownValue}>-{formatCurrency(result.lito)}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>Medicare Levy</Text>
              <Text style={styles.breakdownValue}>+{formatCurrency(result.medicare)}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownLabel}>HECS-HELP Repayment</Text>
              <Text style={styles.breakdownValue}>+{formatCurrency(result.hecsRepayment)}</Text>
            </View>
            <View style={[styles.breakdownItem, styles.totalTaxItem]}>
              <Text style={[styles.breakdownLabel, styles.boldText]}>Total Tax Payable</Text>
              <Text style={[styles.breakdownValue, styles.boldText]}>{formatCurrency(result.finalTax)}</Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={[styles.actionButton, styles.pdfButton]} onPress={exportPDF}>
              <Ionicons name="document-outline" size={18} color="#fff" />
              <Text style={styles.actionButtonText}>Export PDF</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={exportCSV}>
              <Ionicons name="download-outline" size={18} color="#fff" />
              <Text style={styles.actionButtonText}>Export CSV</Text>
            </TouchableOpacity>

            {!viewingCalculation && (
              <TouchableOpacity style={[styles.actionButton, styles.saveButton]} onPress={handleSaveCalculation}>
                <Ionicons name="bookmark-outline" size={18} color="#fff" />
                <Text style={styles.actionButtonText}>Save Calculation</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.fullRowButtonsContainer}>
            <TouchableOpacity
              style={styles.fullRowHomeButton}
              onPress={navigateToHome}
            >
              <Ionicons name="home-outline" size={18} color="#4A90E2" />
              <Text style={styles.fullRowButtonText}>Back to Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.fullRowEditButton}
              onPress={() => {
                setCurrentStep(1);
              }}
            >
              <Ionicons name="create-outline" size={18} color="#4A90E2" />
              <Text style={styles.fullRowButtonText}>Edit Calculation</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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

  // Render based on current screen
  if (currentScreen === 'home') {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <HomeScreen
          onCreateNew={navigateToCalculator}
          onViewCalculation={viewCalculation}
        />
      </View>
    );
  }

  // Calculator screen
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
      <Animated.View
        style={{
          opacity: headerOpacityAnim,
          transform: [{ scale: headerScaleAnim }]
        }}
      >
        <LinearGradient
          colors={['#000000', '#1a1a1a', '#000000']}
          style={styles.header}
        >
          <View style={styles.headerAccent} />
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={navigateToHome}
            >
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {viewingCalculation ? 'Saved Calculation' : 'Australia Tax Return'}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>

      <StepIndicator />

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {renderCurrentStep()}
      </ScrollView>

      {currentStep < 4 && (
        <View style={styles.bottomButtonContainer}>
          <NavigationButtons />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}