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
              {formatCurrency(calculation.result?.totalIncome || 0)}
            </Text>
          </View>
          
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Tax Payable:</Text>
            <Text style={styles.cardValue}>
              {formatCurrency(calculation.result?.totalTax || 0)}
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
      <LinearGradient
        colors={['#4A90E2', '#357ABD', '#2C5F8C']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Australia Tax Return</Text>
          <Text style={styles.headerSubtitle}>Your Tax Calculations</Text>
        </View>
      </LinearGradient>

      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.createNewButton} onPress={onCreateNew}>
          <LinearGradient
            colors={['#4A90E2', '#357ABD']}
            style={styles.createNewGradient}
          >
            <Ionicons name="add-circle" size={24} color="#fff" />
            <Text style={styles.createNewText}>Create New Calculation</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {savedCalculations.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyStateTitle}>No Saved Calculations</Text>
            <Text style={styles.emptyStateText}>
              Start by creating your first tax calculation above
            </Text>
          </View>
        ) : (
          <View style={styles.calculationsContainer}>
            <Text style={styles.sectionTitle}>
              Saved Calculations ({savedCalculations.length})
            </Text>
            {savedCalculations.map(renderCalculationCard)}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E1E9F4',
    opacity: 0.9,
  },
  actionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  createNewButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  createNewGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  createNewText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  calculationsContainer: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
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
