import React, { useState } from 'react';
import { Shield, Sparkles, Mail, Lock, LogIn, Database, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthPage = ({ onContinueAsGuest, onOpenSupabaseConfig }) => {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, isSupabaseConfigured } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUpWithEmail(email, password, displayName);
        if (error) setErrorMsg(error.message);
      } else {
        const { error } = await signInWithEmail(email, password);
        if (error) setErrorMsg(error.message);
      }
    } catch (err) {
      setErrorMsg(err.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <div className="parchment-card w-full max-w-md rounded-3xl p-8 border-2 border-gold-500 shadow-2xl relative">
        <div className="gold-corner-box"></div>

        {/* Logo Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-crimson-700 border-2 border-gold-400 flex items-center justify-center mx-auto text-gold-300 font-serif-thai text-3xl font-extrabold shadow-seal mb-3">
            ส
          </div>
          <h2 className="text-2xl font-extrabold font-serif-thai text-crimson-800 tracking-wide">
            เข้าสู่ระบบ "สัจจะ"
          </h2>
          <p className="text-xs text-ink-faded mt-1">
            บันทึกคำมั่นสัญญาและดัชนีสัจจะบารมีส่วนบุคคล
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-100 border border-rose-300 text-rose-800 text-xs text-center font-serif-thai">
            {errorMsg}
          </div>
        )}

        {/* Google Login Button */}
        <button
          type="button"
          onClick={signInWithGoogle}
          className="w-full mb-4 py-3 px-4 rounded-xl bg-white border border-gold-600/40 text-stone-800 font-bold font-serif-thai text-xs shadow-sm hover:bg-stone-50 flex items-center justify-center gap-2 transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>เข้าสู่ระบบด้วย Google</span>
        </button>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-gold-600/30 w-full"></div>
          <span className="bg-parchment-100 px-3 text-[11px] text-ink-faded font-serif-thai">หรือใช้อีเมล</span>
          <div className="border-t border-gold-600/30 w-full"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-bold font-serif-thai text-ink mb-1">
                ชื่อแสดงผล (Display Name):
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="เช่น: สมศักดิ์ สัจจะมั่นคง"
                className="w-full rounded-xl bg-parchment-50 border border-gold-600/40 p-2.5 text-xs text-ink focus:outline-none focus:border-crimson-700"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold font-serif-thai text-ink mb-1">
              อีเมล (Email):
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full rounded-xl bg-parchment-50 border border-gold-600/40 p-2.5 text-xs text-ink focus:outline-none focus:border-crimson-700"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold font-serif-thai text-ink mb-1">
              รหัสผ่าน (Password):
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl bg-parchment-50 border border-gold-600/40 p-2.5 text-xs text-ink focus:outline-none focus:border-crimson-700"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-crimson-700 hover:bg-crimson-800 text-gold-300 font-bold font-serif-thai text-xs shadow-md border border-gold-500/40 transition-transform active:scale-95"
          >
            {loading ? 'กำลังดำเนินการ...' : isSignUp ? 'ลงทะเบียนสร้างบัญชี' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-crimson-800 font-serif-thai font-bold hover:underline"
          >
            {isSignUp ? 'มีบัญชีอยู่แล้ว? เข้าสู่ระบบ' : 'ยังไม่มีบัญชี? สมัครใช้งานใหม่'}
          </button>
        </div>

        {/* Continue as Guest Demo */}
        <div className="mt-6 pt-4 border-t border-gold-600/20 text-center space-y-2">
          <button
            type="button"
            onClick={onContinueAsGuest}
            className="w-full py-2.5 px-3 rounded-xl bg-parchment-200/80 hover:bg-parchment-300 text-ink text-xs font-bold font-serif-thai flex items-center justify-center gap-1.5"
          >
            <span>ทดลองใช้งานทันทีในโหมด Demo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onOpenSupabaseConfig}
            className="text-[11px] text-ink-faded hover:text-crimson-800 flex items-center justify-center gap-1 mx-auto"
          >
            <Database className="w-3 h-3" />
            <span>ตั้งค่า Supabase URL & Anon Key</span>
          </button>
        </div>
      </div>
    </div>
  );
};
