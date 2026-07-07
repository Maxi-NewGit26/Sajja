import React, { useState } from 'react';
import { X, Database, Check, Copy, ExternalLink, ShieldCheck } from 'lucide-react';
import { saveSupabaseConfig, clearSupabaseConfig, isSupabaseConfigured } from '../lib/supabase';

export const SupabaseConfigModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [url, setUrl] = useState(localStorage.getItem('sajja_supabase_url') || '');
  const [key, setKey] = useState(localStorage.getItem('sajja_supabase_key') || '');
  const [copiedSql, setCopiedSql] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    saveSupabaseConfig(url, key);
  };

  const handleClear = () => {
    clearSupabaseConfig();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="parchment-card w-full max-w-xl rounded-2xl p-6 border-2 border-gold-500 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-ink-faded hover:bg-parchment-300 hover:text-crimson-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4 border-b border-gold-600/20 pb-3">
          <div className="p-2.5 rounded-xl bg-crimson-700/10 text-crimson-800 border border-crimson-700/30">
            <Database className="w-6 h-6 text-crimson-800" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-serif-thai text-crimson-800">
              การเชื่อมต่อ Supabase Cloud Database
            </h3>
            <p className="text-xs text-ink-faded">
              สถานะปัจจุบัน: <strong className={isSupabaseConfigured() ? 'text-emerald-700 font-bold' : 'text-amber-800 font-bold'}>
                {isSupabaseConfigured() ? '✓ เชื่อมต่อ Supabase Live แล้ว' : '⚡ โหมดสาธิต (Local Demo Mode)'}
              </strong>
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-ink mb-1">
              Supabase Project URL:
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-project.supabase.co"
              className="w-full rounded-lg bg-parchment-50 border border-gold-600/40 p-2.5 text-xs text-ink focus:outline-none focus:border-crimson-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink mb-1">
              Supabase Anon Key:
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full rounded-lg bg-parchment-50 border border-gold-600/40 p-2.5 text-xs text-ink focus:outline-none focus:border-crimson-700 font-mono"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {isSupabaseConfigured() && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1.5 rounded text-xs text-rose-800 bg-rose-100 hover:bg-rose-200 border border-rose-300 font-serif-thai"
              >
                สลับกลับโหมด Demo
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded text-xs text-ink-faded hover:bg-parchment-300 font-serif-thai"
              >
                ปิดหน้าต่าง
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded bg-crimson-700 hover:bg-crimson-800 text-gold-300 text-xs font-bold font-serif-thai shadow border border-gold-500/40"
              >
                บันทึกการตั้งค่า
              </button>
            </div>
          </div>
        </form>

        {/* Database setup instructions & SQL file helper */}
        <div className="mt-6 pt-4 border-t border-gold-600/20 bg-parchment-200/50 p-4 rounded-xl border border-gold-600/30">
          <h4 className="text-xs font-bold font-serif-thai text-crimson-800 mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-gold-600" />
            <span>คำแนะนำการตั้งค่าฐานข้อมูลใน Supabase:</span>
          </h4>
          <ol className="text-xs text-ink-light space-y-1 list-decimal list-inside leading-relaxed mb-3">
            <li>สร้างโปรเจกต์ใหม่ที่ <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-crimson-700 underline inline-flex items-center gap-0.5">Supabase.com <ExternalLink className="w-3 h-3"/></a></li>
            <li>ไปที่เมนู <strong>SQL Editor</strong> และนำสคริปต์ <code>supabase_schema.sql</code> ในโปรเจกต์ไปวางเพื่อสร้างตารางข้อมูล</li>
            <li>ไปที่ <strong>Authentication &gt; Providers</strong> เพื่อเปิดใช้งาน <strong>Email</strong> และ <strong>Google Login</strong></li>
          </ol>
        </div>
      </div>
    </div>
  );
};
