
// File: src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Context Providers
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { PregnancyProvider } from './context/PregnancyContext';
import { CalendarProvider } from './context/CalendarContext';
import { MilestoneProvider } from './context/MilestoneContext';
import { JournalProvider } from './context/JournalContext';
import { SymptomsProvider } from './context/SymptomsContext';
import { ChatProvider } from './context/ChatContext';
import { AchievementsProvider } from './context/AchievementsContext';
import { NotificationProvider } from './context/NotificationContext';

// Layout Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import BottomNavigation from './components/common/BottomNavigation';
import CelebrationSystem from './components/common/CelebrationSystem';
import PageTransition from './components/common/PageTransition';
import AchievementNotification from './components/common/AchievementNotification';

// Page Components
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Milestones from './pages/Milestones';
import Journal from './pages/Journal';
import Photos from './pages/Photos';
import Resources from './pages/Resources';
import Symptoms from './pages/Symptoms';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Styles
import './styles/variables.css';
import './styles/global.css';
import './App.css';

// Animated Routes component that has access to router context
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/calendar" element={<PageTransition><Calendar /></PageTransition>} />
        <Route path="/milestones" element={<PageTransition><Milestones /></PageTransition>} />
        <Route path="/journal" element={<PageTransition><Journal /></PageTransition>} />
        <Route path="/photos" element={<PageTransition><Photos /></PageTransition>} />
        <Route path="/resources" element={<PageTransition><Resources /></PageTransition>} />
        <Route path="/symptoms" element={<PageTransition><Symptoms /></PageTransition>} />
        <Route path="/chat" element={<PageTransition><Chat /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

// Layout wrapper component that has access to router context
function AppLayout() {

  return (
    <div className="app">
      {/* Header - visible on all pages */}
      <Header 
        showUserMenu={true}
        showNotifications={true}
      />

      {/* Main Content Area with Animated Routes */}
      <main className="main-content">
        <AnimatedRoutes />
      </main>

      {/* Footer - visible on all pages */}
      <Footer 
        showResourceLinks={true}
        showSupportInfo={true}
        showNewsletter={true}
        compact={false}
      />

      {/* Bottom Navigation - always visible for development */}
      <BottomNavigation
        showBadges={true}
        hideOnDesktop={false}
      />
      
      {/* Global Celebration System */}
      <CelebrationSystem />
      
      {/* Achievement Notifications */}
      <AchievementNotification />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AppProvider>
          <NotificationProvider>
            <AchievementsProvider>
              <PregnancyProvider>
                <CalendarProvider>
                  <MilestoneProvider>
                    <JournalProvider>
                      <SymptomsProvider>
                        <ChatProvider>
                          <AppLayout />
                        </ChatProvider>
                      </SymptomsProvider>
                    </JournalProvider>
                  </MilestoneProvider>
                </CalendarProvider>
              </PregnancyProvider>
            </AchievementsProvider>
          </NotificationProvider>
        </AppProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;