import React, { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import LandingPage  from './components/LandingPage';
import AnalyzerPage from './components/AnalyzerPage';

// Navigation : 'splash' → 'landing' → 'analyzer'
export default function App() {
  const [page, setPage] = useState('splash');

  if (page === 'splash')   return <SplashScreen onEnter={() => setPage('landing')} />;
  if (page === 'landing')  return <LandingPage  onAnalyze={() => setPage('analyzer')} />;
  return                          <AnalyzerPage onBack={() => setPage('landing')} />;
}
