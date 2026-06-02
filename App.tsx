/**
 * Main App Entry Point
 * This file serves as the entry point and imports the main App component from src
 */

import React from 'react';
import AppErrorBoundary from './src/components/common/AppErrorBoundary';
import App from './src/App';
import { initializeCrashReporting } from './src/services/crashReportingService';

initializeCrashReporting();

export default function RootApp() {
  return (
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  );
}
