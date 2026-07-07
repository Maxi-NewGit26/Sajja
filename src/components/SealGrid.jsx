import React from 'react';
import { ShieldCheck, Award, Crown, Users, Sparkles, Lock } from 'lucide-react';

export const SealGrid = ({ seals = [] }) => {
  const getIcon = (iconName, isUnlocked) => {
    const cls = `w-8 h-8 ${isUnlocked ? 'text-gold-300' : 'text-stone-400'}`;
    switch (iconName) {
      case 'ShieldCheck': return <ShieldCheck className={cls} />;
      case 'Award': return <Award className={cls} />;
      case 'Crown': return <Crown className={cls} />;
      case 'Users': return <Users className={cls} />;
      case 'Sparkles': return <Sparkles className={cls} />;
      default: return <Award className={cls} />;
    }
  };

  const getSealBg = (type, isUnlocked) => {
    if (!isUnlocked) return 'bg-stone-200 border-stone-300 opacity-60';
    if (type === 'gold') return 'bg-gradient-to-br from-amber-600 via-gold-500 to-amber-700 border-gold-300 shadow-gold-glow';
    if (type === 'silver') return 'bg-gradient-to-br from-slate-400 via-stone-300 to-slate-500 border-white shadow-md';
    if (type === 'witness') return 'bg-gradient-to-br from-emerald-700 via-teal-600 to-emerald-900 border-teal-300 shadow-md';
    return 'bg-gradient-to-br from-amber-800 via-amber-700 to-amber-900 border-amber-400 shadow-md';
  };

  return (
    <div className="parchment-card rounded-2xl p-5 border border-gold-600/40 shadow-sm">
      <div className="flex items-center justify-between border-b border-gold-600/20 pb-3 mb-5">
        <div>
          <h3 className="text-xl font-bold font-serif-thai text-crimson-800 flex items-center gap-2">
            <Award className="w-5 h-5 text-gold-600" />
            <span>ตราสัจจะบารมี (Seals & Achievements)</span>
          </h3>
          <p className="text-xs text-ink-faded mt-0.5">เหรียญเกียรติยศที่มอบให้ตามความซื่อสตรงและความเพียร</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {seals.map((seal) => {
          const isUnlocked = seal.unlocked;
          return (
            <div
              key={seal.id}
              className={`p-4 rounded-xl border flex items-start gap-4 transition-transform hover:-translate-y-0.5 ${
                isUnlocked
                  ? 'bg-parchment-50 border-gold-500/50 shadow-sm'
                  : 'bg-parchment-200/50 border-stone-300/60 opacity-70'
              }`}
            >
              {/* Seal Badge Icon Circle */}
              <div className={`w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center border-2 ${getSealBg(seal.seal_type, isUnlocked)}`}>
                {isUnlocked ? getIcon(seal.icon_name, true) : <Lock className="w-6 h-6 text-stone-500" />}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`font-bold font-serif-thai text-sm truncate ${isUnlocked ? 'text-crimson-900' : 'text-stone-600'}`}>
                    {seal.title}
                  </h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isUnlocked ? 'bg-gold-500/20 text-gold-900 border border-gold-600/30' : 'bg-stone-300 text-stone-700'
                  }`}>
                    {isUnlocked ? 'ปลดล็อกแล้ว' : 'ยังไม่บรรลุ'}
                  </span>
                </div>
                <p className="text-xs text-ink-light mt-1 line-clamp-2 leading-relaxed">
                  {seal.description}
                </p>
                <div className="text-[11px] text-ink-faded font-serif-thai mt-2">
                  เงื่อนไข: {seal.unlocked_at}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
