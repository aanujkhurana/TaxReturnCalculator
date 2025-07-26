/**
 * Sidebar Component
 * A slide-out navigation sidebar with links to different pages
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { APP_INFO } from '../../constants/appConstants';

const { width: screenWidth } = Dimensions.get('window');
const SIDEBAR_WIDTH = Math.min(280, screenWidth * 0.75);

const Sidebar = ({ visible, onClose, onNavigate, currentScreen }) => {
  const { theme } = useTheme();
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Slide in animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Slide out animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -SIDEBAR_WIDTH,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleNavigate = (screen) => {
    onNavigate(screen);
    onClose();
  };

  const menuItems = [
    {
      id: 'home',
      title: 'Home',
      subtitle: 'Dashboard & Calculations',
      icon: 'home-outline',
      activeIcon: 'home',
    },
    {
      id: 'about',
      title: 'About',
      subtitle: 'App Information',
      icon: 'information-circle-outline',
      activeIcon: 'information-circle',
    },
  ];

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    sidebar: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: SIDEBAR_WIDTH,
      backgroundColor: theme.surface,
      shadowColor: theme.shadow,
      shadowOffset: { width: 2, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 16,
    },
    header: {
      paddingTop: 60,
      paddingHorizontal: 24,
      paddingBottom: 24,
      backgroundColor: theme.primary,
      borderBottomWidth: 1,
      borderBottomColor: theme.primaryBorder,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerTextContainer: {
      flex: 1,
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
    closeButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    menuContainer: {
      flex: 1,
      paddingTop: 16,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 16,
      marginHorizontal: 12,
      marginVertical: 4,
      borderRadius: 12,
      backgroundColor: 'transparent',
    },
    menuItemActive: {
      backgroundColor: theme.primaryLight,
      borderWidth: 1,
      borderColor: theme.primaryBorder,
    },
    menuItemIcon: {
      width: 24,
      height: 24,
      marginRight: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuItemContent: {
      flex: 1,
    },
    menuItemTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 2,
    },
    menuItemTitleActive: {
      color: theme.primary,
    },
    menuItemSubtitle: {
      fontSize: 13,
      color: theme.textSecondary,
      fontWeight: '400',
    },
    footer: {
      paddingHorizontal: 24,
      paddingVertical: 20,
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
    version: {
      fontWeight: '600',
      color: theme.textSecondary,
    },
  });

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: overlayAnim }]}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <Animated.View
              style={[
                styles.sidebar,
                {
                  transform: [{ translateX: slideAnim }],
                },
              ]}
            >
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerContent}>
                  <View style={styles.headerTextContainer}>
                    <Text style={styles.headerTitle}>{APP_INFO.NAME}</Text>
                    <Text style={styles.headerSubtitle}>Navigation Menu</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={onClose}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Menu Items */}
              <View style={styles.menuContainer}>
                {menuItems.map((item) => {
                  const isActive = currentScreen === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.menuItem,
                        isActive && styles.menuItemActive,
                      ]}
                      onPress={() => handleNavigate(item.id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.menuItemIcon}>
                        <Ionicons
                          name={isActive ? item.activeIcon : item.icon}
                          size={22}
                          color={isActive ? theme.primary : theme.textSecondary}
                        />
                      </View>
                      <View style={styles.menuItemContent}>
                        <Text
                          style={[
                            styles.menuItemTitle,
                            isActive && styles.menuItemTitleActive,
                          ]}
                        >
                          {item.title}
                        </Text>
                        <Text style={styles.menuItemSubtitle}>
                          {item.subtitle}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  <Text style={styles.version}>{APP_INFO.NAME}</Text>
                  {'\n'}Version {APP_INFO.VERSION}
                  {'\n'}© 2024 Tax Calculator
                </Text>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default Sidebar;
