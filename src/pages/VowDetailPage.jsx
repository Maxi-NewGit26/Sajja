import React, { useState } from 'react';
import { ArrowLeft, Calendar, MapPin, RefreshCw, CheckCircle2, BookOpen, Users, ShieldAlert, Sparkles } from 'lucide-react';
import { useSajja } from '../context/SajjaContext';
import { SajjaCalendar } from '../components/SajjaCalendar';
import { VowJourneyPath } from '../components/VowJourneyPath';
import { CheckInModal } from '../components/CheckInModal';

export const VowDetailPage = ({ vow, onBack }) => {
  const { checkIns, recordCheckIn, toggleMilestone, updateVowDetails } = useSajja();

  const [selectedDateModal, setSelectedDateModal] = useState(null);
  const [showAdjustVowModal, setShowAdjustVowModal] = useState(false);
  const [adjustedOathQuote, setAdjustedOathQuote] = useState(vow?.oath_quote || '');

  if (!vow) return null;

  const vowCheckIns = checkIns.filter(c => c.vow_id === vow.id);
  const todayStr = new Date().toISOString().split('T')[0];
  const todayCheckIn = vowCheckIns.find(c => c.check_date === todayStr);

  const completedCount = vowCheckIns.filter(c => c.status === 'completed').length;
  const adjustedCount = vowCheckIns.filter(c => c.status === 'adjusted').length;

  const handleSelectCalendarDate = (dateStr, checkIn) => {
    setSelectedDateModal({ dateStr, checkIn });
  };

  const handleSaveAdjustedVow = (e) => {
    e.preventDefault();
    if (!adjustedOathQuote.trim()) return;
    updateVowDetails(vow.id, {
      oath_quote: adjustedOathQuote,
      status: 'active'
    });
    setShowAdjustVowModal(false);
    alert('ปรับคำสัตย์ใหม่เรียบร้อยแล้ว — ยังคงความซื่อสตรงต่อตนเองด้วยความเมตตา');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs text-ink-faded hover:text-crimson-800 flex items-center gap-1 font-serif-thai font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ย้อนกลับไปหน้าหลัก</span>
        </button>

        <button
          onClick={() => setShowAdjustVowModal(true)}
          className="px-3.5 py-1.5 rounded-lg bg-amber-100 border border-gold-500 text-amber-900 text-xs font-bold font-serif-thai hover:bg-amber-200 flex items-center gap-1.5 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5 text-gold-700" />
          <span>ปรับคำสัตย์ใหม่</span>
        </button>
      </div>

      {/* Sacred Oath Banner */}
      <div className="parchment-card parchment-card-active rounded-3xl p-6 sm:p-8 border-2 border-gold-500 shadow-parchment relative overflow-hidden">
        <div className="gold-corner-box"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <span className="text-xs px-3 py-1 rounded-full bg-crimson-700/10 text-crimson-800 border border-crimson-700/30 font-serif-thai font-bold">
            {vow.category}
          </span>
          <div className="text-xs text-ink-faded flex items-center gap-1 font-serif-thai">
            <Calendar className="w-3.5 h-3.5 text-gold-700" />
            <span>ระยะเวลา: {vow.start_date} ถึง {vow.end_date}</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-thai text-crimson-800 leading-tight">
          {vow.title}
        </h1>

        {/* Oath Quote Display */}
        <blockquote className="my-4 p-4 rounded-2xl bg-parchment-200/90 border-l-4 border-crimson-700 text-sm sm:text-base font-serif-thai italic text-crimson-950 leading-relaxed shadow-inner">
          "{vow.oath_quote}"
        </blockquote>

        {/* Quick Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-gold-600/20 text-center">
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-xs text-emerald-800 font-serif-thai block">ทำสำเร็จ</span>
            <strong className="text-xl font-bold font-serif-thai text-emerald-900">{completedCount} วัน</strong>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300">
            <span className="text-xs text-amber-800 font-serif-thai block">ปรับคำสัตย์</span>
            <strong className="text-xl font-bold font-serif-thai text-amber-900">{adjustedCount} วัน</strong>
          </div>

          <div className="p-2.5 rounded-xl bg-parchment-100 border border-gold-600/30">
            <span className="text-xs text-ink-faded font-serif-thai block">หมุดหมาย</span>
            <strong className="text-xl font-bold font-serif-thai text-crimson-800">
              {(vow.milestones || []).filter(m => m.is_completed).length} / {(vow.milestones || []).length}
            </strong>
          </div>

          <div className="p-2.5 rounded-xl bg-parchment-100 border border-gold-600/30">
            <span className="text-xs text-ink-faded font-serif-thai block">พยานสัจจะ</span>
            <strong className="text-xl font-bold font-serif-thai text-crimson-800 font-sans">
              {(vow.witnesses || []).length} คน
            </strong>
          </div>
        </div>
      </div>

      {/* INTERACTIVE SAJJA CALENDAR */}
      <SajjaCalendar
        vow={vow}
        checkIns={checkIns}
        onSelectDate={handleSelectCalendarDate}
      />

      {/* VOW JOURNEY PATH */}
      <VowJourneyPath
        vow={vow}
        onToggleMilestone={toggleMilestone}
      />

      {/* Journal Reflections History Timeline */}
      <div className="parchment-card rounded-2xl p-5 border border-gold-600/40 shadow-sm">
        <h3 className="text-lg font-bold font-serif-thai text-crimson-800 flex items-center gap-2 mb-4 border-b border-gold-600/20 pb-3">
          <BookOpen className="w-5 h-5 text-crimson-700" />
          <span>บันทึกสัจจะ (Journal History)</span>
        </h3>

        {vowCheckIns.filter(c => c.note).length === 0 ? (
          <p className="text-xs text-ink-faded text-center py-4">
            ยังไม่มีบันทึกข้อคิดประจำวัน กดที่วันในปฏิทินด้านบนเพื่อเพิ่มบันทึกได้เลย
          </p>
        ) : (
          <div className="space-y-3">
            {vowCheckIns.filter(c => c.note).reverse().map((c) => (
              <div key={c.id} className="p-3.5 bg-parchment-100 rounded-xl border border-gold-600/30 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-crimson-800 font-serif-thai">{c.check_date}</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    c.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900 border border-gold-400'
                  }`}>
                    {c.status === 'completed' ? '✓ ทำสำเร็จ' : '✕ ปรับคำสัตย์'}
                  </span>
                </div>
                <p className="text-ink-light italic">"{c.note}"</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Date Check-in Modal */}
      {selectedDateModal && (
        <CheckInModal
          isOpen={Boolean(selectedDateModal)}
          onClose={() => setSelectedDateModal(null)}
          vow={vow}
          dateStr={selectedDateModal.dateStr}
          existingCheckIn={selectedDateModal.checkIn}
          onSave={recordCheckIn}
        />
      )}

      {/* Adjust Vow Modal */}
      {showAdjustVowModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="parchment-card w-full max-w-md rounded-2xl p-6 border-2 border-gold-500 shadow-2xl">
            <h3 className="text-xl font-bold font-serif-thai text-crimson-800 mb-2 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-gold-600" />
              <span>ปรับคำสัตย์ใหม่ (Adjust Vow)</span>
            </h3>
            <p className="text-xs text-ink-light mb-4 leading-relaxed">
              ระบบสัจจะไม่ออกแบบมาเพื่อตัดสินว่าคุณ "ล้มเหลว" แต่ช่วยให้คุณปรับเปลี่ยนเงื่อนไขหรือเจตนารมณ์ใหม่เพื่อเดินหน้าต่อด้วยความซื่อสตรงต่อตนเอง
            </p>

            <form onSubmit={handleSaveAdjustedVow} className="space-y-4">
              <div>
                <label className="block text-xs font-bold font-serif-thai text-ink mb-1">
                  ปรับปรุงคำปฏิญาณ / กุศโลบายใหม่:
                </label>
                <textarea
                  value={adjustedOathQuote}
                  onChange={(e) => setAdjustedOathQuote(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl bg-parchment-50 border border-gold-600/40 p-3 text-xs text-ink focus:outline-none focus:border-crimson-700"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdjustVowModal(false)}
                  className="px-4 py-2 rounded text-xs text-ink-faded font-serif-thai"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-crimson-700 text-gold-300 text-xs font-bold font-serif-thai shadow border border-gold-500/40"
                >
                  บันทึกคำสัตย์ใหม่
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
