import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SajjaProvider } from './context/SajjaContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { DashboardPage } from './pages/DashboardPage';
import { CreateVowPage } from './pages/CreateVowPage';
import { VowDetailPage } from './pages/VowDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthPage } from './pages/AuthPage';

import { useSajja } from './context/SajjaContext';

function MainApp() {
  const { user, loading: authLoading } = useAuth();
  const { vows } = useSajja();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedVow, setSelectedVow] = useState(null);
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);

  const handleSelectVow = (vow) => {
    setSelectedVow(vow);
    setActiveTab('vow-detail');
  };

  const handleVowCreated = (newVow) => {
    setSelectedVow(newVow);
    setActiveTab('vow-detail');
  };

  const handleSelectTab = (tab) => {
    if (tab === 'vow-detail') {
      if (!selectedVow) {
        const activeVows = vows.filter(v => v.status === 'active');
        if (activeVows.length > 0) {
          setSelectedVow(activeVows[0]);
        } else if (vows.length > 0) {
          setSelectedVow(vows[0]);
        } else {
          alert('คุณยังไม่มีสัจจะที่บันทึกไว้ กรุณาสร้างสัจจะข้อแรกก่อนเพื่อดูเส้นทาง');
          setActiveTab('create');
          return;
        }
      }
    } else if (tab === 'dashboard') {
      setSelectedVow(null);
    }
    setActiveTab(tab);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-parchment-100 flex flex-col items-center justify-center font-serif-thai text-crimson-800 text-lg font-bold gap-3">
        <div className="w-12 h-12 rounded-full bg-crimson-700 border-2 border-gold-400 flex items-center justify-center text-gold-300 font-extrabold text-xl animate-pulse shadow-seal">
          ส
        </div>
        <span>กำลังเชื่อมเข้าสู่สัจจะบารมี...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-parchment-100 pb-20 sm:pb-0 flex flex-col justify-between selection:bg-crimson-700 selection:text-parchment-100">
        <AuthPage onOpenSupabaseConfig={() => setShowSupabaseModal(true)} />
        <SupabaseConfigModal
          isOpen={showSupabaseModal}
          onClose={() => setShowSupabaseModal(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-parchment-100 selection:bg-crimson-700 selection:text-parchment-100 pb-20 sm:pb-0">
      <div>
        <Navbar
          activeTab={activeTab}
          setActiveTab={handleSelectTab}
          onOpenSupabaseConfig={() => setShowSupabaseModal(true)}
        />

        <main className="pb-16 sm:pb-12">
          {activeTab === 'dashboard' && (
            <DashboardPage
              setActiveTab={setActiveTab}
              onSelectVow={handleSelectVow}
            />
          )}

          {activeTab === 'create' && (
            <CreateVowPage
              onCancel={() => setActiveTab('dashboard')}
              onCreated={handleVowCreated}
            />
          )}

          {activeTab === 'vow-detail' && selectedVow && (
            <VowDetailPage
              vow={selectedVow}
              onBack={() => setActiveTab('dashboard')}
            />
          )}

          {activeTab === 'profile' && (
            <ProfilePage
              onOpenSupabaseConfig={() => setShowSupabaseModal(true)}
            />
          )}
        </main>
      </div>

      {/* Sacred Ceremonial Footer */}
      <footer className="border-t border-gold-600/30 bg-parchment-200/60 py-6 text-center text-xs text-ink-faded font-serif-thai space-y-1 mb-16 sm:mb-0">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-crimson-700 text-gold-300 font-bold flex items-center justify-center text-xs">ส</span>
            <span className="font-bold text-crimson-800 text-sm">สัจจะ (Sajja App)</span>
          </div>
          <p>การรักษาคำมั่นสัญญาต่อตนเองด้วยความซื่อสตรงและปัญญา</p>
          <p>© 2026 Sajja — Progressive Web Application</p>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={handleSelectTab}
      />

      {/* Supabase Settings Modal */}
      <SupabaseConfigModal
        isOpen={showSupabaseModal}
        onClose={() => setShowSupabaseModal(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SajjaProvider>
        <MainApp />
      </SajjaProvider>
    </AuthProvider>
  );
}
