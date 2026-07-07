import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, RefreshCw, BookOpen, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CheckInModal = ({ isOpen, onClose, vow, dateStr, existingCheckIn, onSave }) => {
  if (!isOpen || !vow) return null;

  const [status, setStatus] = useState(existingCheckIn?.status || 'completed');
  const [note, setNote] = useState(existingCheckIn?.note || '');

  useEffect(() => {
    if (existingCheckIn) {
      setStatus(existingCheckIn.status);
      setNote(existingCheckIn.note || '');
    } else {
      setStatus('completed');
      setNote('');
    }
  }, [existingCheckIn, dateStr]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(vow.id, dateStr, status, note);

    if (status === 'completed') {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#D4AF37', '#7A1C1C', '#16A34A']
      });
    }

    onClose();
  };

  const formattedDate = new Date(dateStr).toLocaleDateString('th-TH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="parchment-card w-full max-w-lg rounded-2xl p-6 border-2 border-gold-500 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-ink-faded hover:bg-parchment-300 hover:text-crimson-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5 border-b border-gold-600/20 pb-3">
          <span className="text-xs font-serif-thai px-3 py-1 rounded-full bg-crimson-700/10 text-crimson-800 border border-crimson-700/30">
            บันทึกสัจจะประจำวัน
          </span>
          <h3 className="text-xl font-bold font-serif-thai text-crimson-800 mt-2">
            {vow.title}
          </h3>
          <p className="text-xs text-ink-faded mt-1">{formattedDate}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Status Options */}
          <div>
            <label className="block text-sm font-bold font-serif-thai text-ink mb-2">
              เลือกสถานะความซื่อสตรงของวันนี้:
            </label>
            
            <div className="grid grid-cols-2 gap-3">
              {/* Completed option */}
              <button
                type="button"
                onClick={() => setStatus('completed')}
                className={`p-4 rounded-xl border-2 text-left flex flex-col justify-between transition-all ${
                  status === 'completed'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-md ring-2 ring-emerald-500/30'
                    : 'border-gold-600/30 bg-parchment-100 hover:bg-parchment-200 text-ink'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle2 className={`w-6 h-6 ${status === 'completed' ? 'text-emerald-600' : 'text-stone-400'}`} />
                  {status === 'completed' && <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />}
                </div>
                <div>
                  <h4 className="font-bold font-serif-thai text-base">✓ ทำสำเร็จ</h4>
                  <p className="text-xs text-ink-faded mt-0.5">รักษาคำสัตย์ตามที่ตั้งมั่นไว้บริบูรณ์</p>
                </div>
              </button>

              {/* Adjusted option */}
              <button
                type="button"
                onClick={() => setStatus('adjusted')}
                className={`p-4 rounded-xl border-2 text-left flex flex-col justify-between transition-all ${
                  status === 'adjusted'
                    ? 'border-gold-500 bg-amber-50 text-amber-950 shadow-md ring-2 ring-gold-500/30'
                    : 'border-gold-600/30 bg-parchment-100 hover:bg-parchment-200 text-ink'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <RefreshCw className={`w-5 h-5 ${status === 'adjusted' ? 'text-gold-600' : 'text-stone-400'}`} />
                </div>
                <div>
                  <h4 className="font-bold font-serif-thai text-base">✕ ปรับคำสัตย์</h4>
                  <p className="text-xs text-ink-faded mt-0.5">ปรับเงื่อนไขให้เหมาะกับสถานการณ์โดยไม่หลอกตัวเอง</p>
                </div>
              </button>
            </div>
          </div>

          {/* Journal Reflection Note */}
          <div>
            <label className="block text-sm font-bold font-serif-thai text-ink mb-1 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-crimson-700" />
              <span>บันทึกความรู้สึก / สัจจะ journal (สั้นๆ):</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="เขียนสะท้อนสติ เหตุการณ์ หรือเหตุผลในการปรับคำสัตย์..."
              rows={3}
              className="w-full rounded-xl bg-parchment-50 border border-gold-600/40 p-3 text-sm text-ink focus:outline-none focus:border-crimson-700 focus:ring-1 focus:ring-crimson-700"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-ink-faded hover:bg-parchment-300 font-serif-thai"
            >
              ยกเลิก
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-crimson-700 hover:bg-crimson-800 text-gold-300 font-bold font-serif-thai shadow-md border border-gold-500/40 transition-transform active:scale-95 flex items-center gap-2"
            >
              <span>บันทึกความซื่อสตรง</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
