import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
  const { theme, isDark } = useTheme();
  const styles = getStyles(theme);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;
  const titleSlideAnim = useRef(new Animated.Value(50)).current;
  const subtitleSlideAnim = useRef(new Animated.Value(30)).current;
  const creditSlideAnim = useRef(new Animated.Value(20)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start the splash screen animation sequence
    startAnimationSequence();
  }, []);

  const startAnimationSequence = () => {
    // Initial fade in and scale
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Logo rotation animation
    Animated.timing(logoRotateAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    // Staggered text animations
    setTimeout(() => {
      Animated.timing(titleSlideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 400);

    setTimeout(() => {
      Animated.timing(subtitleSlideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 600);

    setTimeout(() => {
      Animated.timing(creditSlideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 800);

    // Progress bar animation
    setTimeout(() => {
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
      }).start();
    }, 1000);

    // Pulse animation for logo
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    
    setTimeout(() => {
      pulseAnimation.start();
    }, 1200);

    // Finish splash screen after total duration
    setTimeout(() => {
      // Fade out animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onFinish();
      });
    }, 3000); // Total splash duration: 3 seconds
  };

  const logoRotation = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar style={isDark ? "light" : "dark"} />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={isDark 
          ? [theme.background, theme.surface, theme.surfaceSecondary]
          : [theme.primaryLight, theme.surface, theme.background]
        }
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Main Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo Container */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [
                { rotate: logoRotation },
                { scale: pulseAnim },
              ],
            },
          ]}
        >
          <View style={styles.logoBackground}>
            <Ionicons
              name="calculator"
              size={64}
              color={theme.primary}
            />
          </View>
        </Animated.View>

        {/* App Title */}
        <Animated.View
          style={[
            styles.titleContainer,
            {
              transform: [{ translateY: titleSlideAnim }],
            },
          ]}
        >
          <Text style={styles.appTitle}>Australia Tax Return</Text>
          <Text style={styles.appSubtitle}>Professional Tax Calculator</Text>
        </Animated.View>

        {/* Version Info */}
        <Animated.View
          style={[
            styles.versionContainer,
            {
              transform: [{ translateY: subtitleSlideAnim }],
            },
          ]}
        >
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.taglineText}>Accurate • Fast • Reliable</Text>
        </Animated.View>

        {/* Progress Bar */}
        <Animated.View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressWidth,
                },
              ]}
            />
          </View>
          <Text style={styles.loadingText}>Loading...</Text>
        </Animated.View>
      </Animated.View>

      {/* Credit */}
      <Animated.View
        style={[
          styles.creditContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: creditSlideAnim }],
          },
        ]}
      >
        <Text style={styles.creditText}>Made by Anuj Khurana</Text>
      </Animated.View>
    </View>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 2,
    borderColor: theme.primaryBorder,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.text,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  appSubtitle: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  versionText: {
    fontSize: 14,
    color: theme.textTertiary,
    marginBottom: 4,
  },
  taglineText: {
    fontSize: 14,
    color: theme.primary,
    fontWeight: '600',
    letterSpacing: 1,
  },
  progressContainer: {
    alignItems: 'center',
    width: '100%',
  },
  progressTrack: {
    width: 200,
    height: 4,
    backgroundColor: theme.borderLight,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.primary,
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 12,
    color: theme.textSecondary,
    fontWeight: '500',
  },
  creditContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 50 : 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  creditText: {
    fontSize: 14,
    color: theme.textTertiary,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});

export default SplashScreen;
