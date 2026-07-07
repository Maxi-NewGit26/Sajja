import React from 'react';
import { Calendar, CheckCircle2, Flame, MapPin, ArrowRight, Shield, RefreshCw } from 'lucide-react';

export const VowCard = ({ vow, checkIns = [], onSelectVow, onQuickCheckIn }) => {
  const vowCheckIns = checkIns.filter(c => c.vow_id === vow.id);
  const todayStr = new Date().toISOString().split('T')[0];
  const todayCheckIn = vowCheckIns.find(c => c.check_date === todayStr);

  const completedMilestones = (vow.milestones || []).filter(m => m.is_completed).length;
  const totalMilestones = (vow.milestones || []).length;

  return (
    <div className="parchment-card parchment-card-active rounded-2xl p-6 border-2 border-gold-600/40 shadow-parchment transition-all hover:shadow-xl hover:border-gold-500 group relative">
      {/* Gold Corner Accents */}
      <div className="gold-corner-box"></div>

      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-crimson-700/10 text-crimson-800 border border-crimson-700/30 font-serif-thai">
            {vow.category}
          </span>
          <h3 className="text-xl font-bold font-serif-thai text-crimson-800 mt-1.5 group-hover:text-crimson-600 transition-colors">
            {vow.title}
          </h3>
        </div>

        {/* Seal Emblem Mini Badge */}
        <div className="w-10 h-10 rounded-full bg-seal-pattern border border-gold-400 flex-shrink-0 flex items-center justify-center text-gold-300 font-serif-thai font-black shadow-seal">
          ส
        </div>
      </div>

      {/* Oath Quote Banner */}
      <div className="bg-parchment-200/80 p-3.5 rounded-xl border-l-4 border-crimson-700 mb-4">
        <p className="text-xs font-serif-thai text-ink italic leading-relaxed">
          "{vow.oath_quote}"
        </p>
      </div>

      {/* Milestone progress line */}
      <div className="flex items-center justify-between text-xs text-ink-faded mb-4 bg-parchment-100 p-2.5 rounded-lg border border-gold-600/20">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-crimson-700" />
          <span>หมุดหมาย: <strong>{completedMilestones} / {totalMilestones}</strong></span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-gold-700" />
          <span>{vow.start_date} ถึง {vow.end_date}</span>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-gold-600/20 gap-2">
        {/* Today Status Badge */}
        <div>
          {todayCheckIn ? (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
              todayCheckIn.status === 'completed' 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                : 'bg-amber-100 text-amber-900 border border-gold-400'
            }`}>
              {todayCheckIn.status === 'completed' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <RefreshCw className="w-3.5 h-3.5 text-gold-600" />}
              <span>{todayCheckIn.status === 'completed' ? 'วันนี้ทำสำเร็จแล้ว' : 'ปรับคำสัตย์แล้ว'}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-dashed border-stone-400">
              ยังไม่ได้บันทึกวันนี้
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Check-in Button */}
          <button
            onClick={(e) => { e.stopPropagation(); onQuickCheckIn(vow, todayStr, todayCheckIn); }}
            className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-serif-thai text-xs font-semibold shadow-sm transition-transform active:scale-95"
          >
            บันทึกวันนี้
          </button>

          {/* Detail Page Button */}
          <button
            onClick={() => onSelectVow(vow)}
            className="px-3.5 py-1.5 rounded-lg bg-crimson-700 hover:bg-crimson-800 text-gold-300 font-serif-thai text-xs font-semibold shadow-sm border border-gold-500/40 flex items-center gap-1 transition-transform active:scale-95"
          >
            <span>เส้นทาง</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
