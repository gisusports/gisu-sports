import React, { useState, Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage'; // Eagerly loaded for instant 0ms first render

// Code-split other pages so the initial bundle remains super fast and lightweight
const LiveScorePage = lazy(() => import('./pages/LiveScorePage').then(m => ({ default: m.LiveScorePage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ServicesPage = lazy(() => import('./pages/ServicesPage').then(m => ({ default: m.ServicesPage })));
const CommunityPage = lazy(() => import('./pages/CommunityPage').then(m => ({ default: m.CommunityPage })));
const SportIdPage = lazy(() => import('./pages/SportIdPage').then(m => ({ default: m.SportIdPage })));
const FeedbackPage = lazy(() => import('./pages/FeedbackPage').then(m => ({ default: m.FeedbackPage })));
const NewsPage = lazy(() => import('./pages/NewsPage').then(m => ({ default: m.NewsPage })));
const ConsolePage = lazy(() => import('./pages/ConsolePage').then(m => ({ default: m.ConsolePage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const VerifyPage = lazy(() => import('./pages/VerifyPage').then(m => ({ default: m.VerifyPage })));

// Sleek, minimal loading fallback
const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 py-24">
    <div className="w-10 h-10 rounded-full border-3 border-[#071E10] border-t-[#B5F438] animate-spin" />
    <span className="text-xs font-mono font-bold text-[#071E10] uppercase tracking-wider">
      Loading Page...
    </span>
  </div>
);

export function AppContent() {
  const getInitialTab = (): string => {
    if (typeof window === 'undefined') return 'home';
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam) return tabParam;
    const path = window.location.pathname.replace(/^\//, '').split('/')[0];
    if (path === 'verify' || window.location.pathname.startsWith('/verify') || params.has('card')) {
      return 'verify';
    }
    if (['home', 'livescore', 'about', 'services', 'community', 'sport-id', 'feedback', 'news', 'console', 'login'].includes(path)) {
      return path;
    }
    return 'home';
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialTab);
  const { activeRole, currentUser } = useAuth();
  const isExecutive = Boolean(
    currentUser &&
    (activeRole === 'director' || activeRole === 'faculty_sport_officer' || activeRole === 'media_officer')
  );

  React.useEffect(() => {
    const handlePopState = () => {
      setActiveTab(getInitialTab());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (tab === 'home') {
        url.pathname = '/';
        url.search = '';
      } else {
        url.searchParams.set('tab', tab);
      }
      window.history.pushState({}, '', url.toString());
    }
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage setActiveTab={handleTabChange} />;
      case 'livescore':
        return (
          <Suspense fallback={<PageLoader />}>
            <LiveScorePage setActiveTab={handleTabChange} />
          </Suspense>
        );
      case 'about':
        return (
          <Suspense fallback={<PageLoader />}>
            <AboutPage />
          </Suspense>
        );
      case 'services':
        return (
          <Suspense fallback={<PageLoader />}>
            <ServicesPage setActiveTab={handleTabChange} />
          </Suspense>
        );
      case 'community':
        return (
          <Suspense fallback={<PageLoader />}>
            <CommunityPage />
          </Suspense>
        );
      case 'sport-id':
        return (
          <Suspense fallback={<PageLoader />}>
            <SportIdPage />
          </Suspense>
        );
      case 'verify':
        return (
          <Suspense fallback={<PageLoader />}>
            <VerifyPage />
          </Suspense>
        );
      case 'feedback':
        return (
          <Suspense fallback={<PageLoader />}>
            <FeedbackPage />
          </Suspense>
        );
      case 'news':
        return (
          <Suspense fallback={<PageLoader />}>
            <NewsPage />
          </Suspense>
        );
      case 'console':
        if (!isExecutive) {
          return (
            <Suspense fallback={<PageLoader />}>
              <LoginPage setActiveTab={handleTabChange} />
            </Suspense>
          );
        }
        return (
          <Suspense fallback={<PageLoader />}>
            <ConsolePage />
          </Suspense>
        );
      case 'login':
        return (
          <Suspense fallback={<PageLoader />}>
            <LoginPage setActiveTab={handleTabChange} />
          </Suspense>
        );
      default:
        return <HomePage setActiveTab={handleTabChange} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8FAF6] text-[#0B1220] overflow-x-hidden">
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />
      
      <main className="flex-1">
        {renderActivePage()}
      </main>

      <Footer setActiveTab={handleTabChange} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
