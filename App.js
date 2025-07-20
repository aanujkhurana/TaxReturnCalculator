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
  ActivityIndicator
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Styles definition
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 4,
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
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
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
    marginLeft: 8,
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
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
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
    fontSize: 28,
    fontWeight: '800',
    color: '#2D3748',
    textAlign: 'center',
    letterSpacing: 0.5,
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
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  saveButton: {
    backgroundColor: '#28a745',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
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
    paddingVertical: 12,
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
  navButtonPrimary: {
    backgroundColor: '#4A90E2',
    borderColor: '#3A7BC2',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  navButtonText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
    marginLeft: 6,
  },
  navButtonTextPrimary: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginRight: 6,
  },
  navButtonSpacer: {
    flex: 1,
  },
  startOverButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  startOverButtonText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
    marginLeft: 8,
  },
});

// Memoized InputField component to prevent unnecessary re-renders
const InputField = memo(({ label, value, onChangeText, placeholder, keyboardType = 'numeric', multiline = false, icon }) => {
  // Filter input for numeric fields to only allow numbers and decimal point
  const handleTextChange = (text) => {
    if (keyboardType === 'numeric') {
      // Allow only numbers, decimal point, and handle empty string
      const filteredText = text.replace(/[^0-9.]/g, '');

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
      const filteredText = text.replace(/[^0-9]/g, '');
      onChangeText(filteredText);
    } else {
      onChangeText(text);
    }
  };

  return (
    <View style={styles.inputContainer}>
      <View style={styles.labelContainer}>
        <Ionicons name={icon} size={18} color="#4A90E2" />
        <Text style={styles.inputLabel}>{label}</Text>
      </View>
      <TextInput
        style={[styles.input, multiline && styles.multilineInput]}
        value={value}
        onChangeText={handleTextChange}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        placeholderTextColor="#999"
        returnKeyType="done"
      />
    </View>
  );
});

InputField.displayName = 'InputField';

export default function App() {
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Form data
  const [jobIncomes, setJobIncomes] = useState(['']);
  const [taxWithheld, setTaxWithheld] = useState('');
  const [deductions, setDeductions] = useState({
    workRelated: '',
    selfEducation: '',
    donations: '',
    other: ''
  });
  const [workFromHomeHours, setWorkFromHomeHours] = useState('');
  const [abnIncome, setAbnIncome] = useState('');
  const [hecsDebt, setHecsDebt] = useState(false);
  const [medicareExemption, setMedicareExemption] = useState(false);
  const [dependents, setDependents] = useState('0');
  const [result, setResult] = useState(null);
  const [savedCalculations, setSavedCalculations] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);
  const loadingPulseAnim = new Animated.Value(1);

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

  // Memoized deduction update functions
  const updateWorkRelatedDeduction = useCallback((value) => {
    setDeductions(prev => ({ ...prev, workRelated: value }));
  }, []);

  const updateSelfEducationDeduction = useCallback((value) => {
    setDeductions(prev => ({ ...prev, selfEducation: value }));
  }, []);

  const updateDonationsDeduction = useCallback((value) => {
    setDeductions(prev => ({ ...prev, donations: value }));
  }, []);

  const updateOtherDeduction = useCallback((value) => {
    setDeductions(prev => ({ ...prev, other: value }));
  }, []);

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
      // Validate step 1 (income) before allowing navigation to later steps
      const hasValidJobIncome = jobIncomes.some(income => {
        const trimmed = income?.trim();
        const parsed = parseFloat(trimmed);
        return trimmed && !isNaN(parsed) && parsed > 0;
      });

      const hasValidAbnIncome = abnIncome?.trim() && !isNaN(parseFloat(abnIncome.trim())) && parseFloat(abnIncome.trim()) > 0;

      if (!hasValidJobIncome && !hasValidAbnIncome) {
        Alert.alert('Complete Income First', 'Please enter at least one income source before proceeding.');
        return;
      }

      const taxWithheldTrimmed = taxWithheld?.trim();
      if (!taxWithheldTrimmed || isNaN(parseFloat(taxWithheldTrimmed)) || parseFloat(taxWithheldTrimmed) < 0) {
        Alert.alert('Complete Income First', 'Please enter a valid tax withheld amount before proceeding.');
        return;
      }
    }

    setCurrentStep(step);
  };

  // Step validation
  const validateCurrentStep = useCallback(() => {
    switch (currentStep) {
      case 1: // Income step
        // Check if at least one income source has a valid positive value
        const hasValidJobIncome = jobIncomes.some(income => {
          const trimmed = income?.trim();
          const parsed = parseFloat(trimmed);
          return trimmed && !isNaN(parsed) && parsed > 0;
        });

        const hasValidAbnIncome = abnIncome?.trim() && !isNaN(parseFloat(abnIncome.trim())) && parseFloat(abnIncome.trim()) > 0;

        if (!hasValidJobIncome && !hasValidAbnIncome) {
          Alert.alert('Validation Error', 'At least one income source (TFN job or ABN income) is required and must be greater than 0');
          return false;
        }

        // Check tax withheld
        const taxWithheldTrimmed = taxWithheld?.trim();
        const taxWithheldParsed = parseFloat(taxWithheldTrimmed);

        if (!taxWithheldTrimmed || isNaN(taxWithheldParsed) || taxWithheldParsed < 0) {
          Alert.alert('Validation Error', 'Tax withheld is required and must be a valid number (0 or greater)');
          return false;
        }
        return true;
      case 2: // Deductions step - optional, always valid
        return true;
      case 3: // Details step - optional, always valid
        return true;
      case 4: // Results step
        return true;
      default:
        return true;
    }
  }, [currentStep, jobIncomes, abnIncome, taxWithheld]);

  const validateInputs = () => {
    const errors = [];

    // Check tax withheld
    const taxWithheldTrimmed = taxWithheld?.trim();
    if (!taxWithheldTrimmed || isNaN(parseFloat(taxWithheldTrimmed)) || parseFloat(taxWithheldTrimmed) < 0) {
      errors.push('Tax withheld is required and must be a valid number (0 or greater)');
    }

    // Check if at least one income source has a valid positive value
    const hasValidJobIncome = jobIncomes.some(income => {
      const trimmed = income?.trim();
      const parsed = parseFloat(trimmed);
      return trimmed && !isNaN(parsed) && parsed > 0;
    });

    const hasValidAbnIncome = abnIncome?.trim() && !isNaN(parseFloat(abnIncome.trim())) && parseFloat(abnIncome.trim()) > 0;

    if (!hasValidJobIncome && !hasValidAbnIncome) {
      errors.push('At least one income source (TFN job or ABN income) is required and must be greater than 0');
    }

    if (errors.length > 0) {
      Alert.alert('Validation Error', errors.join('\n'));
      return false;
    }
    return true;
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
    const totalManualDeductions = Object.values(deductions).reduce((sum, val) => {
      return sum + (parseFloat(val || '0'));
    }, 0);
    const totalDeductions = totalManualDeductions + workFromHomeDeduction;

    const totalIncome = totalTFNIncome + abnIncomeNum;
    const taxableIncome = Math.max(0, totalIncome - totalDeductions);

    // 2024-25 tax brackets
    let tax = 0;
    if (taxableIncome > 190000) {
      tax = 29467 + (taxableIncome - 190000) * 0.45;
    } else if (taxableIncome > 120000) {
      tax = 22967 + (taxableIncome - 120000) * 0.37;
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
    const medicareThreshold = dependentsNum > 0 ? 27355 + (dependentsNum * 4237) : 26000;
    let medicare = 0;
    if (medicareExemption && taxableIncome > medicareThreshold) {
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
      workFromHomeDeduction,
      totalManualDeductions,
      totalDeductions,
      taxableIncome,
      tax,
      lito,
      medicare,
      hecsRepayment,
      finalTax,
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

  const saveCalculation = (name) => {
    if (!result) {
      Alert.alert('Error', 'Please calculate your tax first');
      return;
    }

    if (!name || !name.trim()) {
      Alert.alert('Error', 'Please enter a name for this calculation');
      return;
    }

    const calculation = {
      id: Date.now().toString(),
      name: name.trim(),
      date: new Date().toLocaleDateString('en-AU'),
      ...result
    };

    setSavedCalculations([...savedCalculations, calculation]);
    Alert.alert('Success', 'Calculation saved successfully!');
  };

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
      {currentStep > 1 && (
        <TouchableOpacity style={styles.navButton} onPress={prevStep}>
          <Ionicons name="chevron-back" size={20} color="#4A90E2" />
          <Text style={styles.navButtonText}>Previous</Text>
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
          style={[styles.navButton, styles.navButtonPrimary, isCalculating && { opacity: 0.7 }]}
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
        onChangeText={setAbnIncome}
        placeholder="Self-employed income (e.g., 15000)"
        icon="business-outline"
      />

      <InputField
        label="Tax Withheld (PAYG)"
        value={taxWithheld}
        onChangeText={setTaxWithheld}
        placeholder="Total tax withheld (e.g., 12500)"
        icon="card-outline"
      />
    </View>
  );

  const renderDeductionsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Tax Deductions</Text>
      
      <InputField
        label="Work-Related Expenses"
        value={deductions.workRelated}
        onChangeText={updateWorkRelatedDeduction}
        placeholder="Tools, uniforms, travel (e.g., 2500)"
        icon="construct-outline"
      />

      <InputField
        label="Self-Education Expenses"
        value={deductions.selfEducation}
        onChangeText={updateSelfEducationDeduction}
        placeholder="Courses, books, conferences (e.g., 1200)"
        icon="school-outline"
      />

      <InputField
        label="Charitable Donations"
        value={deductions.donations}
        onChangeText={updateDonationsDeduction}
        placeholder="Tax-deductible donations (e.g., 500)"
        icon="heart-outline"
      />

      <InputField
        label="Other Deductions"
        value={deductions.other}
        onChangeText={updateOtherDeduction}
        placeholder="Investment, tax agent fees (e.g., 800)"
        icon="receipt-outline"
      />

      <InputField
        label="Work From Home Hours"
        value={workFromHomeHours}
        onChangeText={setWorkFromHomeHours}
        placeholder="Total WFH hours (e.g., 400 = $268 deduction)"
        icon="home-outline"
      />

      <View style={styles.wfhInfo}>
        <Ionicons name="information-circle-outline" size={16} color="#666" />
        <Text style={styles.infoText}>
          Work from home calculated at $0.67/hour (ATO shortcut method)
        </Text>
      </View>
    </View>
  );

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
        <Ionicons 
          name={medicareExemption ? "checkbox-outline" : "square-outline"} 
          size={24} 
          color={medicareExemption ? "#4A90E2" : "#666"} 
        />
        <Text style={[styles.toggleText, medicareExemption && styles.toggleTextActive]}>
          Apply Medicare Levy (2% of taxable income)
        </Text>
      </TouchableOpacity>

      <InputField
        label="Number of Dependents"
        value={dependents}
        onChangeText={setDependents}
        placeholder="Number of children/dependents (e.g., 2)"
        keyboardType="number-pad"
        icon="people-outline"
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
                style={[styles.navButton, styles.navButtonPrimary, { marginTop: 16 }]}
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
        <Text style={{ fontSize: 16, color: 'red', marginBottom: 10 }}>DEBUG: Results rendering</Text>
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
            <TouchableOpacity style={styles.actionButton} onPress={exportCSV}>
              <Ionicons name="download-outline" size={18} color="#fff" />
              <Text style={styles.actionButtonText}>Export CSV</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, styles.saveButton]} onPress={() => {
              Alert.prompt(
                'Save Calculation',
                'Enter a name for this calculation:',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Save', onPress: (name) => name && saveCalculation(name) }
                ],
                'plain-text'
              );
            }}>
              <Ionicons name="bookmark-outline" size={18} color="#fff" />
              <Text style={styles.actionButtonText}>Save</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.startOverButton}
            onPress={() => {
              setCurrentStep(1);
              setResult(null);
            }}
          >
            <Ionicons name="refresh-outline" size={18} color="#4A90E2" />
            <Text style={styles.startOverButtonText}>Start New Calculation</Text>
          </TouchableOpacity>
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
      <LinearGradient
        colors={['#4A90E2', '#357ABD', '#2C5F8C']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>TaxMate AU</Text>
        <Text style={styles.headerSubtitle}>Australian Tax Calculator 2024-25</Text>
      </LinearGradient>

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