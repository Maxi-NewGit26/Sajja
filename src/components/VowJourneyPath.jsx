import React from 'react';
import { MapPin, CheckCircle, Circle, Flag, Calendar } from 'lucide-react';

export const VowJourneyPath = ({ vow, onToggleMilestone }) => {
  if (!vow) return null;

  const milestones = vow.milestones || [];
  const completedCount = milestones.filter(m => m.is_completed).length;
  const totalCount = milestones.length;

  return (
    <div className="parchment-card rounded-2xl p-5 border border-gold-600/40 shadow-sm my-6">
      <div className="flex items-center justify-between border-b border-gold-600/20 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-crimson-700" />
          <h3 className="text-lg font-bold font-serif-thai text-crimson-800">
            เส้นทางสัจจะ (หมุดหมายการเดินทาง)
          </h3>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-gold-500/20 text-gold-900 font-bold border border-gold-600/30">
          หมุดหมาย: {completedCount} / {totalCount}
        </span>
      </div>

      {milestones.length === 0 ? (
        <p className="text-sm text-ink-faded italic text-center py-4">
          ยังไม่ได้กำหนดหมุดหมายย่อยระหว่างทาง
        </p>
      ) : (
        <div className="relative pl-6 py-2 space-y-6 before:content-[''] before:absolute before:left-3.5 before:top-4 before:bottom-4 before:w-1 before:bg-gradient-to-b before:from-crimson-700 before:via-gold-500 before:to-stone-300">
          {milestones.map((m, idx) => {
            const isCompleted = m.is_completed;
            return (
              <div key={m.id || idx} className="relative flex items-start gap-4 group">
                {/* Checkpoint Pin Icon */}
                <button
                  onClick={() => onToggleMilestone && onToggleMilestone(vow.id, m.id)}
                  className={`relative -left-6 z-10 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer ${
                    isCompleted
                      ? 'bg-emerald-600 border-gold-400 text-white shadow-md scale-110'
                      : 'bg-parchment-100 border-gold-600 text-gold-700 hover:scale-105'
                  }`}
                  title={isCompleted ? 'คลิกเพื่อยกเลิกการผ่านหมุดหมาย' : 'คลิกเมื่อผ่านหมุดหมายนี้'}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : idx === milestones.length - 1 ? (
                    <Flag className="w-3.5 h-3.5 text-crimson-700" />
                  ) : (
                    <Circle className="w-3 h-3 text-gold-700" />
                  )}
                </button>

                {/* Milestone Info Box */}
                <div className={`flex-1 p-3.5 rounded-xl border transition-all ${
                  isCompleted
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 shadow-sm'
                    : 'bg-parchment-100 border-gold-600/30 text-ink hover:border-gold-600'
                }`}>
                  <div className="flex items-center justify-between">
                    <h4 className={`font-bold font-serif-thai text-sm sm:text-base ${isCompleted ? 'line-through text-emerald-900 opacity-80' : 'text-crimson-900'}`}>
                      {m.title}
                    </h4>
                    <span className="text-[11px] text-ink-faded flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {m.target_date}
                    </span>
                  </div>

                  {isCompleted && (
                    <p className="text-[11px] text-emerald-700 mt-1 font-medium">
                      ✓ พิชิตหมุดหมายแล้วเมื่อ {m.completed_at || 'วันนี้'}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
