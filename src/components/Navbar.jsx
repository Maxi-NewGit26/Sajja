import { Shield, Sparkles, PlusCircle, User, Database, Flame, LogIn, LogOut } from 'lucide-react';
import { useSajja } from '../context/SajjaContext';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ activeTab, setActiveTab, onOpenSupabaseConfig }) => {
  const { sajjaScore, currentStreak } = useSajja();
  const { user, isDemoMode, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-parchment-100/95 backdrop-blur-md border-b border-gold-600/30 shadow-sm">
      <div className="max-w-5xl mx-auto px-3 py-2.5 sm:py-3 flex items-center justify-between">
        
        {/* Logo & Title */}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-crimson-700 border-2 border-gold-500 flex items-center justify-center text-gold-300 font-serif-thai font-bold text-lg sm:text-xl shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
            ส
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif-thai text-crimson-800 tracking-wide flex items-center gap-1">
              สัจจะ
              <span className="text-[10px] sm:text-xs font-sans px-1.5 py-0.5 rounded bg-gold-500/20 text-gold-900 border border-gold-600/30">
                สัจจะบารมี
              </span>
            </h1>
            <p className="text-[10px] text-ink-faded hidden md:block">การรักษาคำมั่นสัญญาต่อตนเอง</p>
          </div>
        </div>

        {/* Center Score & Streak Badges */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Streak */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-600/30 text-amber-900 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500 animate-pulse" />
            <span className="text-[11px] sm:text-xs">สายสัจจะ: <strong className="text-amber-800 font-bold">{currentStreak}</strong>d</span>
          </div>

          {/* Sajja Score */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-crimson-700/10 border border-crimson-700/30 text-crimson-900 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span className="text-[11px] sm:text-xs">ดัชนี: <strong className="text-crimson-800 font-bold font-serif-thai text-sm">{sajjaScore}%</strong></span>
          </div>
        </div>

        {/* Right Navigation Actions */}
        <div className="flex items-center gap-2">
          {/* New Vow Button (Desktop only) */}
          <button
            onClick={() => setActiveTab('create')}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-crimson-700 hover:bg-crimson-800 text-gold-300 font-medium text-xs sm:text-sm shadow-md border border-gold-500/40 transition-all hover:shadow-gold-glow active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-gold-400" />
            <span className="font-serif-thai">✦ ตั้งสัจจะใหม่</span>
          </button>

          {/* Login / Logout Button */}
          {isDemoMode ? (
            <button
              onClick={() => setActiveTab('auth')}
              className={`px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg border text-xs font-serif-thai font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'auth'
                  ? 'bg-crimson-700 text-gold-300 border-gold-500'
                  : 'bg-parchment-200/80 hover:bg-parchment-300 border-gold-600/30 text-crimson-900'
              }`}
              title="เข้าสู่ระบบ"
            >
              <LogIn className="w-4 h-4 text-crimson-700" />
              <span className="hidden sm:inline">เข้าสู่ระบบ</span>
            </button>
          ) : (
            <button
              onClick={signOut}
              className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-serif-thai font-semibold flex items-center gap-1.5 transition-all"
              title="ออกจากระบบ"
            >
              <LogOut className="w-4 h-4 text-rose-700" />
              <span className="hidden sm:inline">ออกจากระบบ</span>
            </button>
          )}

          {/* Profile / Seals button (Desktop only) */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`hidden sm:block p-2 rounded-lg border transition-all ${
              activeTab === 'profile'
                ? 'bg-gold-500/20 border-gold-600 text-crimson-800'
                : 'border-gold-600/30 text-ink hover:bg-parchment-200'
            }`}
            title="โปรไฟล์และตราสัจจะ"
          >
            <User className="w-5 h-5" />
          </button>

          {/* Supabase Status / Setup button */}
          <button
            onClick={onOpenSupabaseConfig}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1 ${
              isDemoMode 
                ? 'bg-amber-100 border-amber-400 text-amber-800' 
                : 'bg-emerald-100 border-emerald-400 text-emerald-800'
            }`}
            title={isDemoMode ? "โหมดสาธิต (เปิดตั้งค่า Supabase)" : "เชื่อมต่อ Supabase แล้ว"}
          >
            <Database className="w-4 h-4" />
            <span className="hidden lg:inline text-[11px] font-semibold">
              {isDemoMode ? 'Demo Mode' : 'Supabase Live'}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};
