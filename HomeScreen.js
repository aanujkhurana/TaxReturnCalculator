import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const HomeScreen = ({ onCreateNew, onViewCalculation }) => {
  const [savedCalculations, setSavedCalculations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

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
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Ionicons name="document-text" size={20} color="#4A90E2" />
            <Text style={styles.cardTitle}>
              {calculation.name || `Tax Calculation ${calculation.id.slice(-4)}`}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteCalculation(calculation.id)}
          >
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Total Income:</Text>
            <Text style={styles.cardValue}>
              {formatCurrency(totalIncome)}
            </Text>
          </View>

          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Tax Payable:</Text>
            <Text style={styles.cardValue}>
              {formatCurrency(totalTax)}
            </Text>
          </View>

          <View style={[styles.cardRow, styles.refundRow]}>
            <Text style={[styles.cardLabel, { color: statusColor }]}>{statusText}:</Text>
            <Text style={[styles.cardValue, styles.refundValue, { color: statusColor }]}>
              {formatCurrency(Math.abs(refund))}
            </Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.cardDate}>
            Saved: {formatDate(calculation.savedDate)}
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Modern Card-based Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerCard}>
          <View style={styles.headerIconContainer}>
            <Ionicons name="calculator" size={24} color="#4A90E2" />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Australia Tax Return</Text>
            <Text style={styles.headerSubtitle}>Your Tax Calculations</Text>
          </View>
          <View style={styles.headerStats}>
            <Text style={styles.headerStatsText}>
              {savedCalculations.length} saved
            </Text>
          </View>
          <View style={styles.headerAccent} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {savedCalculations.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyStateTitle}>No Saved Calculations</Text>
            <Text style={styles.emptyStateText}>
              Start by creating your first tax calculation using the button below
            </Text>
          </View>
        ) : (
          <View style={styles.calculationsContainer}>
            {savedCalculations.map(renderCalculationCard)}
          </View>
        )}
      </ScrollView>

      {/* Create New Button moved to bottom */}
      <View style={styles.bottomActionContainer}>
        <TouchableOpacity style={styles.createNewButton} onPress={onCreateNew}>
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.createNewGradient}
          >
            <Ionicons name="add-circle" size={28} color="#fff" />
            <Text style={styles.createNewText}>Create New</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  // Modern Card-based Header Styles
  headerContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#F8FAFC',
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    position: 'relative',
    overflow: 'hidden',
    minHeight: 80,
  },
  headerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#E1EFFF',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  headerStats: {
    backgroundColor: '#F0F7FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E1EFFF',
    marginLeft: 12,
  },
  headerStatsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A90E2',
    letterSpacing: 0.2,
  },
  headerAccent: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 4,
    height: '100%',
    backgroundColor: '#4A90E2',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  bottomActionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  createNewButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  createNewGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 32,
  },
  createNewText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 12,
    letterSpacing: 0.5,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: 0.1,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  calculationsContainer: {
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  deleteButton: {
    padding: 4,
  },
  cardContent: {
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  refundRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cardLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  cardValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  refundValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});

export default HomeScreen;
