/**
 * InputField Component
 * A reusable input field with validation, help modal, and smart features
 */

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { HELP_TEXT } from '../../constants/helpText';
import HelpModal from '../ui/HelpModal';

const InputField = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  keyboardType = 'numeric', 
  multiline = false, 
  icon, 
  helpKey, 
  error, 
  editable = true, 
  prefix = '', 
  suffix = '' 
}) => {
  const { theme } = useTheme();
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState(value || '');
  const isTypingRef = useRef(false);

  // Update display value when prop value changes (but not when user is typing)
  useEffect(() => {
    if (!isTypingRef.current) {
      setDisplayValue(value || '');
    }
  }, [value]);

  // Reset typing flag after a delay
  useEffect(() => {
    if (isTypingRef.current) {
      const timer = setTimeout(() => {
        isTypingRef.current = false;
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [displayValue]);

  // Smart suggestions based on field type
  const getSmartSuggestions = (fieldKey) => {
    const suggestions = {
      workRelatedTravel: ['450', '800', '1200', '2000'],
      workRelatedEquipment: ['500', '800', '1500', '3000'],
      workRelatedUniforms: ['200', '300', '500', '800'],
      selfEducationCourseFees: ['800', '1200', '2500', '5000'],
      selfEducationTextbooks: ['150', '300', '500', '800'],
      donationsCharitable: ['100', '250', '500', '1000'],
      otherDeductions: ['200', '500', '1000', '2000']
    };
    return suggestions[fieldKey] || [];
  };

  // Filter input for numeric fields to only allow numbers and decimal point
  const handleTextChange = (text) => {
    // Mark that user is actively typing
    isTypingRef.current = true;

    // Update display value immediately for smooth typing
    setDisplayValue(text);

    if (keyboardType === 'numeric') {
      // Allow numbers, decimal point, and empty string
      const numericText = text.replace(/[^0-9.]/g, '');
      
      // Prevent multiple decimal points
      const parts = numericText.split('.');
      const filteredText = parts.length > 2 
        ? parts[0] + '.' + parts.slice(1).join('') 
        : numericText;

      onChangeText(filteredText);
    } else {
      onChangeText(text);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    isTypingRef.current = false;
  };

  const openHelpModal = () => {
    if (helpKey && HELP_TEXT[helpKey]) {
      setShowHelpModal(true);
    }
  };

  const suggestions = helpKey ? getSmartSuggestions(helpKey) : [];
  const hasValue = displayValue && displayValue.trim() !== '';
  const helpData = helpKey ? HELP_TEXT[helpKey] : null;

  // Dynamic styles based on state
  const getInputStyle = () => {
    const baseStyle = {
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
    };

    if (error) {
      return {
        ...baseStyle,
        borderColor: theme.error,
        borderWidth: 2,
        backgroundColor: theme.errorLight,
      };
    }

    if (!editable) {
      return {
        ...baseStyle,
        backgroundColor: theme.borderLight,
        borderColor: theme.border,
        color: theme.textSecondary,
      };
    }

    if (isFocused) {
      return {
        ...baseStyle,
        borderColor: theme.primary,
        borderWidth: 2,
        shadowColor: theme.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
      };
    }

    if (hasValue) {
      return {
        ...baseStyle,
        backgroundColor: theme.surfaceSecondary,
        borderColor: theme.primaryBorder,
      };
    }

    return baseStyle;
  };

  const inputStyle = getInputStyle();
  if (multiline) {
    inputStyle.height = 80;
    inputStyle.textAlignVertical = 'top';
  }

  return (
    <View style={{ marginBottom: 16 }}>
      {/* Label and Help Icon */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
      }}>
        {icon && (
          <Ionicons 
            name={icon} 
            size={18} 
            color={theme.primary} 
            style={{ marginRight: 8 }} 
          />
        )}
        <Text style={{
          fontSize: 15,
          fontWeight: '600',
          color: theme.text,
          marginLeft: icon ? 0 : 8,
          letterSpacing: 0.2,
          flex: 1,
        }}>
          {label}
        </Text>
        {helpKey && (
          <TouchableOpacity
            onPress={openHelpModal}
            style={{
              padding: 4,
              backgroundColor: hasValue ? theme.primaryLight : 'transparent',
              borderRadius: 12,
            }}
          >
            <Ionicons 
              name="help-circle-outline" 
              size={20} 
              color={theme.primary} 
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Input Field */}
      <View style={{ position: 'relative' }}>
        {prefix && (
          <Text style={{
            position: 'absolute',
            left: 14,
            top: 14,
            fontSize: 16,
            color: theme.textSecondary,
            zIndex: 1,
          }}>
            {prefix}
          </Text>
        )}
        <TextInput
          style={{
            ...inputStyle,
            paddingLeft: prefix ? 30 : 14,
            paddingRight: suffix ? 50 : 14,
          }}
          value={displayValue}
          onChangeText={handleTextChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={theme.textTertiary}
          keyboardType={keyboardType}
          multiline={multiline}
          editable={editable}
        />
        {suffix && (
          <Text style={{
            position: 'absolute',
            right: 14,
            top: 14,
            fontSize: 16,
            color: theme.textSecondary,
          }}>
            {suffix}
          </Text>
        )}
      </View>

      {/* Error Message */}
      {error && (
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 6,
        }}>
          <Ionicons name="alert-circle" size={16} color={theme.error} />
          <Text style={{
            color: theme.error,
            fontSize: 12,
            marginLeft: 4,
            fontWeight: '500',
          }}>
            {error}
          </Text>
        </View>
      )}

      {/* Smart Suggestions */}
      {suggestions.length > 0 && isFocused && !hasValue && (
        <View style={{
          marginTop: 8,
          padding: 12,
          backgroundColor: theme.background,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: theme.border,
        }}>
          <Text style={{
            fontSize: 12,
            fontWeight: '600',
            color: theme.textSecondary,
            marginBottom: 8,
          }}>
            Common amounts:
          </Text>
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
          }}>
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setDisplayValue(suggestion);
                  onChangeText(suggestion);
                }}
                style={{
                  backgroundColor: theme.primary,
                  borderRadius: 16,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                }}
              >
                <Text style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: '#ffffff',
                }}>
                  ${suggestion}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Help Modal */}
      <HelpModal
        visible={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        helpData={helpData}
      />
    </View>
  );
};

export default InputField;
