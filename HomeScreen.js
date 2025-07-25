import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
  Dimensions,
  Linking,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';
import ThemeToggle from './ThemeToggle';

const { width } = Dimensions.get('window');

const HomeScreen = ({ onCreateNew, onViewCalculation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [savedCalculations, setSavedCalculations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isResourcesExpanded, setIsResourcesExpanded] = useState(false);

  useEffect(() => {
    loadSavedCalculations();
  }, []);

  const loadSavedCalculations = async () => {
    try {
      const saved = await AsyncStorage.getItem('savedCalculations');
      if (saved) {
        const calculations = JSON.parse(saved);
        // Sort by date (newest first)
        calculations.sort((a, b) => new Date(b.savedDate) - new Date(a.savedDate));
        setSavedCalculations(calculations);
      } else {
        setSavedCalculations([]);
      }
    } catch (error) {
      console.error('Error loading saved calculations:', error);
      Alert.alert('Error', 'Failed to load saved calculations');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSavedCalculations();
    setRefreshing(false);
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

  const deleteCalculation = async (id) => {
    Alert.alert(
      'Delete Calculation',
      'Are you sure you want to delete this calculation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedCalculations = savedCalculations.filter(calc => calc.id !== id);
              await AsyncStorage.setItem('savedCalculations', JSON.stringify(updatedCalculations));
              setSavedCalculations(updatedCalculations);
            } catch (error) {
              console.error('Error deleting calculation:', error);
              Alert.alert('Error', 'Failed to delete calculation');
            }
          }
        }
      ]
    );
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '0';
    }
    return new Intl.NumberFormat('en-AU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRefundStatusColor = (refund) => {
    if (refund > 0) return '#10B981'; // Green for refund
    if (refund < 0) return '#EF4444'; // Red for amount owed
    return '#6B7280'; // Gray for break-even
  };

  const getRefundStatusText = (refund) => {
    if (refund > 0) return 'Refund Expected';
    if (refund < 0) return 'Amount Owed';
    return 'Break Even';
  };

  const renderCalculationCard = (calculation) => {
    const refund = calculation.result?.refund || 0;
    const statusColor = getRefundStatusColor(refund);
    const statusText = getRefundStatusText(refund);

    // Handle backward compatibility for older saved calculations
    const totalIncome = calculation.result?.totalIncome ||
                       (calculation.result?.totalTFNIncome || 0) + (calculation.result?.abnIncomeNum || 0);
    const totalTax = calculation.result?.totalTax || calculation.result?.finalTax || 0;

    return (
      <TouchableOpacity
        key={calculation.id}
        style={styles.calculationCard}
        onPress={() => onViewCalculation(calculation)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <View style={styles.cardIconContainer}>
              <Ionicons name="document-text" size={22} color="#4A90E2" />
            </View>
            <View style={styles.cardTitleTextContainer}>
              <Text style={styles.cardTitle}>
                {calculation.name || `Tax Calculation ${calculation.id.slice(-4)}`}
              </Text>
              <Text style={styles.cardSubtitle}>
                Financial Year 2024-25
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteCalculation(calculation.id)}
            activeOpacity={0.6}
          >
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardFinancialSummary}>
            <View style={styles.cardSummaryItem}>
              <Text style={styles.cardSummaryLabel}>Total Income</Text>
              <Text style={styles.cardSummaryValue}>
                ${formatCurrency(totalIncome)}
              </Text>
            </View>
            <View style={styles.cardSummaryDivider} />
            <View style={styles.cardSummaryItem}>
              <Text style={styles.cardSummaryLabel}>Tax Payable</Text>
              <Text style={styles.cardSummaryValue}>
                ${formatCurrency(totalTax)}
              </Text>
            </View>
          </View>

          <View style={[styles.cardRefundSection, { backgroundColor: statusColor + '10' }]}>
            <View style={styles.cardRefundHeader}>
              <Ionicons
                name={refund >= 0 ? "trending-up" : "trending-down"}
                size={18}
                color={statusColor}
              />
              <Text style={[styles.cardRefundLabel, { color: statusColor }]}>
                {statusText}
              </Text>
            </View>
            <Text style={[styles.cardRefundAmount, { color: statusColor }]}>
              ${formatCurrency(Math.abs(refund))}
            </Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.cardFooterLeft}>
            <Ionicons name="time-outline" size={14} color="#9CA3AF" />
            <Text style={styles.cardDate}>
              Saved {formatDate(calculation.savedDate)}
            </Text>
          </View>
          <View style={styles.cardFooterRight}>
            <Text style={styles.cardViewText}>View Details</Text>
            <Ionicons name="chevron-forward" size={16} color="#4A90E2" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Simple Header at Top */}
      <View style={styles.fixedHeaderContainer}>
        <View style={styles.fixedHeaderContent}>
          <View style={styles.fixedHeaderTextContainer}>
            <Text style={styles.fixedHeaderTitle}>Australia Tax Return</Text>
            <Text style={styles.fixedHeaderSubtitle}>Professional Tax Calculator</Text>
          </View>
          <View style={styles.fixedHeaderActions}>
            <ThemeToggle style={styles.themeToggle} />
            <View style={styles.fixedHeaderStats}>
              <Text style={styles.fixedHeaderStatsText}>
                {savedCalculations.length} saved
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Collapsible Tax Resources & Guidelines Section */}
        <View style={styles.resourcesContainer}>
          <TouchableOpacity
            style={styles.resourcesHeader}
            onPress={() => setIsResourcesExpanded(!isResourcesExpanded)}
            activeOpacity={0.7}
          >
            <View style={styles.resourcesIconContainer}>
              <Ionicons name="information-circle" size={22} color="#4A90E2" />
            </View>
            <View style={styles.resourcesTitleContainer}>
              <Text style={styles.resourcesTitle}>Tax Resources & Guidelines</Text>
              <Text style={styles.resourcesSubtitle}>Official ATO guidance and tools</Text>
            </View>
            <Ionicons
              name={isResourcesExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color="#4A90E2"
            />
          </TouchableOpacity>
          {isResourcesExpanded && (
            <View style={styles.resourcesGrid}>
            <TouchableOpacity
              style={[styles.resourceButton, styles.resourceButtonPrimary]}
              onPress={() => openExternalURL('https://www.ato.gov.au/individuals/income-deductions-offsets-and-records/deductions/')}
            >
              <View style={styles.resourceButtonIconContainer}>
                <Ionicons name="receipt" size={20} color="#059669" />
              </View>
              <View style={styles.resourceButtonContent}>
                <Text style={styles.resourceButtonTitle}>ATO Deduction Guides</Text>
                <Text style={styles.resourceButtonDescription}>Official deduction rules</Text>
              </View>
              <Ionicons name="open-outline" size={16} color="#6B7280" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.resourceButton, styles.resourceButtonSecondary]}
              onPress={() => openExternalURL('https://www.ato.gov.au/individuals/lodging-your-tax-return/')}
            >
              <View style={styles.resourceButtonIconContainer}>
                <Ionicons name="checkmark-circle" size={20} color="#4A90E2" />
              </View>
              <View style={styles.resourceButtonContent}>
                <Text style={styles.resourceButtonTitle}>ATO Return Checklist</Text>
                <Text style={styles.resourceButtonDescription}>Complete your return</Text>
              </View>
              <Ionicons name="open-outline" size={16} color="#6B7280" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.resourceButton, styles.resourceButtonTertiary]}
              onPress={() => openExternalURL('https://www.ato.gov.au/individuals/income-deductions-offsets-and-records/records-you-need-to-keep/')}
            >
              <View style={styles.resourceButtonIconContainer}>
                <Ionicons name="folder" size={20} color="#F59E0B" />
              </View>
              <View style={styles.resourceButtonContent}>
                <Text style={styles.resourceButtonTitle}>ATO Record Keeping</Text>
                <Text style={styles.resourceButtonDescription}>What to keep & how long</Text>
              </View>
              <Ionicons name="open-outline" size={16} color="#6B7280" />
            </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Saved Calculations Section */}
        {savedCalculations.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyStateIconContainer}>
              <Ionicons name="calculator-outline" size={48} color="#4A90E2" />
            </View>
            <Text style={styles.emptyStateTitle}>Ready to Calculate Your Tax Return?</Text>
            <Text style={styles.emptyStateText}>
              Get started with Australia's most comprehensive tax calculator.
              We'll guide you through each step to maximize your refund.
            </Text>
            <View style={styles.emptyStateFeatures}>
              <View style={styles.emptyStateFeature}>
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                <Text style={styles.emptyStateFeatureText}>ATO compliant calculations</Text>
              </View>
              <View style={styles.emptyStateFeature}>
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                <Text style={styles.emptyStateFeatureText}>Save and track multiple returns</Text>
              </View>
              <View style={styles.emptyStateFeature}>
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                <Text style={styles.emptyStateFeatureText}>Professional guidance included</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.calculationsContainer}>
            <View style={styles.calculationsHeader}>
              <Text style={styles.calculationsTitle}>Your Tax Calculations</Text>
              <Text style={styles.calculationsSubtitle}>
                {savedCalculations.length} saved calculation{savedCalculations.length !== 1 ? 's' : ''}
              </Text>
            </View>
            {savedCalculations.map(renderCalculationCard)}
          </View>
        )}
      </ScrollView>

      {/* Enhanced Create New Button */}
      <View style={styles.bottomActionContainer}>
        <TouchableOpacity
          style={styles.createNewButton}
          onPress={onCreateNew}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.createNewGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.createNewIconContainer}>
              <Ionicons name="add-circle" size={32} color="#fff" />
            </View>
            <View style={styles.createNewTextContainer}>
              <Text style={styles.createNewText}>Create New Calculation</Text>
              <Text style={styles.createNewSubtext}>Start your tax return</Text>
            </View>
            <Ionicons name="arrow-forward" size={24} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  // Simple Fixed Header Styles
  fixedHeaderContainer: {
    paddingTop: Platform.OS === 'ios' ? 44 : 0,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: 'transparent',
  },
  fixedHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fixedHeaderTextContainer: {
    flex: 1,
  },
  fixedHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeToggle: {
    marginRight: 4,
  },
  fixedHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.text,
    letterSpacing: 0.2,
    marginBottom: 2,
  },
  fixedHeaderSubtitle: {
    fontSize: 14,
    color: theme.primary,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  fixedHeaderStats: {
    backgroundColor: theme.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.primaryBorder,
  },
  fixedHeaderStatsText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.primary,
    letterSpacing: 0.1,
  },

  scrollContainer: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 80, // Padding to prevent content hiding behind button
  },
  bottomActionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    backgroundColor: theme.surface,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    elevation: 8,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  createNewButton: {
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
  createNewGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
    minHeight: 56,
  },
  createNewIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  createNewTextContainer: {
    flex: 1,
    marginLeft: 16,
    marginRight: 12,
  },
  createNewText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
    marginBottom: 1,
  },
  createNewSubtext: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 0,
    marginBottom: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  emptyStateIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#E1EFFF',
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.1,
    fontWeight: '500',
    marginBottom: 24,
  },
  emptyStateFeatures: {
    alignSelf: 'stretch',
  },
  emptyStateFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  emptyStateFeatureText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    marginLeft: 10,
    letterSpacing: 0.1,
  },
  calculationsHeader: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  calculationsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  calculationsSubtitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  calculationsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
    marginTop: 8,
    letterSpacing: 0.1,
  },
  calculationCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E1EFFF',
  },
  cardTitleTextContainer: {
    flex: 1,
    paddingTop: 2,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  cardContent: {
    marginBottom: 16,
  },
  cardFinancialSummary: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardSummaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  cardSummaryDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 16,
  },
  cardSummaryLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 4,
    letterSpacing: 0.1,
  },
  cardSummaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: 0.2,
  },
  cardRefundSection: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  cardRefundHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardRefundLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
    letterSpacing: 0.1,
  },
  cardRefundAmount: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  cardFooterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardDate: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    marginLeft: 6,
    letterSpacing: 0.1,
  },
  cardFooterRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardViewText: {
    fontSize: 13,
    color: '#4A90E2',
    fontWeight: '600',
    marginRight: 4,
    letterSpacing: 0.1,
  },

  // Enhanced Tax Resources Section Styles
  resourcesContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 0,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },

  resourcesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 4,
  },

  resourcesIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E1EFFF',
  },

  resourcesTitleContainer: {
    flex: 1,
  },

  resourcesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
    letterSpacing: 0.2,
  },

  resourcesSubtitle: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    letterSpacing: 0.1,
  },

  resourcesGrid: {
    gap: 12,
  },

  resourceButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },

  resourceButtonPrimary: {
    borderColor: '#BBF7D0',
    backgroundColor: '#F0FDF4',
  },

  resourceButtonSecondary: {
    borderColor: '#DBEAFE',
    backgroundColor: '#F0F9FF',
  },

  resourceButtonTertiary: {
    borderColor: '#FEF3C7',
    backgroundColor: '#FFFBEB',
  },

  resourceButtonIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },

  resourceButtonContent: {
    flex: 1,
  },

  resourceButtonTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
    letterSpacing: 0.1,
  },

  resourceButtonDescription: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    letterSpacing: 0.1,
  },
});

export default HomeScreen;
