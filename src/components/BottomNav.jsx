import React from 'react';
import { Home, PlusCircle, Award } from 'lucide-react';
import { useSajja } from '../context/SajjaContext';
import { useAuth } from '../context/AuthContext';

export const BottomNav = ({ activeTab, setActiveTab }) => {
  const { currentStreak, sajjaScore } = useSajja();
  const { user, isDemoMode } = useAuth();

  const navItems = [
    {
      id: 'dashboard',
      label: 'หน้าแรก',
      icon: Home,
    },
    {
      id: 'create',
      label: 'ตั้งสัจจะ',
      icon: PlusCircle,
      isPrimary: true // Ceremonial center button
    },
    {
      id: 'profile',
      label: 'โปรไฟล์',
      icon: Award,
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-parchment-100/95 backdrop-blur-lg border-t-2 border-gold-500/50 shadow-2xl px-2 py-1.5 sm:hidden pb-safe">
      <div className="flex items-center justify-around max-w-md mx-auto relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isPrimary) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab('create')}
                className="relative -top-5 flex flex-col items-center group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full bg-crimson-700 border-2 border-gold-400 flex items-center justify-center text-gold-300 shadow-seal group-active:scale-95 transition-transform gold-glow-pulse">
                  <PlusCircle className="w-7 h-7 text-gold-300" />
                </div>
                <span className="text-[10px] font-serif-thai font-extrabold text-crimson-800 mt-0.5">
                  ✦ ตั้งสัจจะ
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center w-16 py-1 rounded-xl transition-all ${
                isActive
                  ? 'text-crimson-800 font-bold bg-gold-500/20 scale-105'
                  : 'text-ink-faded hover:text-ink'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-crimson-700 stroke-[2.5]' : 'text-stone-500'}`} />
              <span className="text-[10px] font-serif-thai tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
export default BottomNav;
