import React, { useState } from 'react';
import { PlusCircle, Flame, Sparkles, Shield, Heart, Award, Calendar as CalendarIcon } from 'lucide-react';
import { useSajja } from '../context/SajjaContext';
import { SajjaScoreBadge } from '../components/SajjaScoreBadge';
import { VowCard } from '../components/VowCard';
import { CheckInModal } from '../components/CheckInModal';
import { UserAvatar } from '../components/UserAvatar';

export const DashboardPage = ({ setActiveTab, onSelectVow }) => {
  const { vows, checkIns, sajjaScore, currentStreak, recordCheckIn } = useSajja();

  const [activeCheckInModal, setActiveCheckInModal] = useState(null);

  const activeVows = vows.filter(v => v.status === 'active');

  const handleQuickCheckIn = (vow, dateStr, existingCheckIn) => {
    setActiveCheckInModal({ vow, dateStr, existingCheckIn });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 py-6">
      {/* Top Sacred Welcome Banner */}
      <div className="parchment-card rounded-3xl p-6 sm:p-8 border-2 border-gold-500/60 shadow-parchment relative overflow-hidden">
        <div className="gold-corner-box"></div>

        <div className="relative z-10 flex flex-row items-center justify-between gap-4 w-full">
          <div className="space-y-4 flex-1">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-crimson-700/10 text-crimson-800 border border-crimson-700/30 text-xs font-serif-thai font-bold">
                <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                <span>ผู้บำเพ็ญสัจจะบารมี</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold font-serif-thai text-crimson-800 tracking-tight leading-tight">
                "สัจเจนะ กิตติํ ปปฺโปติ — ผู้ยึดมั่นในสัจจะ ย่อมประสบเกียรติยศและสงบเย็น"
              </h2>
              <p className="text-xs sm:text-sm text-ink-light leading-relaxed">
                สัจจะในที่นี้มิใช่เพียงเป้าหมายทั่วไป แต่คือ **ความซื่อตรงต่อตนเอง** ที่ปิดผนึกไว้อย่างมีพิธีการและน้ำหนัก
              </p>
            </div>

            {/* New Vow CTA Button */}
            <button
              onClick={() => setActiveTab('create')}
              className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-crimson-700 hover:bg-crimson-800 text-gold-300 font-bold font-serif-thai text-xs sm:text-sm shadow-xl border border-gold-400 flex items-center gap-2 hover:scale-105 transition-all gold-glow-pulse w-fit"
            >
              <PlusCircle className="w-5 h-5 text-gold-400" />
              <span>✦ เริ่มพิธีตั้งสัจจะใหม่</span>
            </button>
          </div>

          <div className="flex-shrink-0 self-center">
            <UserAvatar size="lg" className="ring-2 ring-gold-400 shadow-md" />
          </div>
        </div>
      </div>

      {/* Sajja Score & Streak Row */}
      <SajjaScoreBadge score={sajjaScore} />

      {/* Active Vows Section */}
      <div>
        <div className="flex items-center justify-between mb-4 border-b border-gold-600/20 pb-2">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-crimson-700" />
            <h3 className="text-xl font-bold font-serif-thai text-crimson-800">
              สัจจะที่กำลังสืบเนื่อง ({activeVows.length})
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('create')}
            className="text-xs text-crimson-700 hover:text-crimson-900 font-serif-thai font-bold flex items-center gap-1"
          >
            + ตั้งสัจเพิ่ม
          </button>
        </div>

        {activeVows.length === 0 ? (
          <div className="parchment-card rounded-2xl p-10 text-center border border-dashed border-gold-600/40">
            <div className="w-16 h-16 rounded-full bg-crimson-700/10 border-2 border-gold-500 flex items-center justify-center mx-auto text-crimson-800 font-serif-thai text-2xl font-bold mb-3">
              ส
            </div>
            <h4 className="text-lg font-bold font-serif-thai text-crimson-800">ยังไม่มีสัจจะที่กำลังดำเนินอยู่</h4>
            <p className="text-xs text-ink-faded mt-1 max-w-sm mx-auto">
              เริ่มต้นสร้างคำมั่นสัญญากับตนเองเพื่อสะสมดัชนีสัจจะและตราสัจจะบารมี
            </p>
            <button
              onClick={() => setActiveTab('create')}
              className="mt-4 px-5 py-2.5 rounded-lg bg-crimson-700 text-gold-300 font-serif-thai text-xs font-bold shadow border border-gold-400"
            >
              ✦ ตั้งสัจจะแรกเริ่ม
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeVows.map((vow) => (
              <VowCard
                key={vow.id}
                vow={vow}
                checkIns={checkIns}
                onSelectVow={onSelectVow}
                onQuickCheckIn={handleQuickCheckIn}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Check-in Modal */}
      {activeCheckInModal && (
        <CheckInModal
          isOpen={Boolean(activeCheckInModal)}
          onClose={() => setActiveCheckInModal(null)}
          vow={activeCheckInModal.vow}
          dateStr={activeCheckInModal.dateStr}
          existingCheckIn={activeCheckInModal.existingCheckIn}
          onSave={recordCheckIn}
        />
      )}
    </div>
  );
};
