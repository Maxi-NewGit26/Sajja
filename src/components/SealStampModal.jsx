import React, { useState } from 'react';
import { Sparkles, CheckCircle, Flame, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SealStampModal = ({ isOpen, vowData, onSealComplete }) => {
  if (!isOpen || !vowData) return null;

  const [isStamped, setIsStamped] = useState(false);
  const [isPressing, setIsPressing] = useState(false);

  const handlePressSeal = () => {
    setIsPressing(true);

    setTimeout(() => {
      setIsStamped(true);
      setIsPressing(false);

      // Trigger grand ceremonial celebration confetti
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#D4AF37', '#7A1C1C', '#F3E5AB', '#997A29']
      });

      // Complete flow after 1.8 seconds
      setTimeout(() => {
        onSealComplete();
      }, 1800);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="parchment-card w-full max-w-lg rounded-3xl p-8 border-4 border-gold-500 shadow-2xl text-center relative overflow-hidden">
        {/* Gold Corner Frame */}
        <div className="gold-corner-box"></div>

        <div className="mb-6">
          <span className="text-xs px-3 py-1 rounded-full bg-crimson-700/10 text-crimson-800 border border-crimson-700/30 font-serif-thai font-bold">
            ขั้นตอนสุดท้าย: พิธีปิดผนึกสัจจะ
          </span>
          <h2 className="text-2xl font-extrabold font-serif-thai text-crimson-800 mt-3">
            ประทับตราสัจจะบารมี
          </h2>
          <p className="text-xs text-ink-light mt-1 max-w-xs mx-auto">
            "คำสัตย์ที่ให้ไว้ต่อตนเอง มีน้ำหนักและความหมายดุจการประทับตราโบราณ"
          </p>
        </div>

        {/* Vow Summary Card inside seal modal */}
        <div className="bg-parchment-200/70 p-4 rounded-xl border border-gold-600/40 mb-8 text-left">
          <h4 className="text-base font-bold font-serif-thai text-crimson-800">{vowData.title}</h4>
          <blockquote className="text-xs text-ink italic mt-1 border-l-2 border-crimson-700 pl-2">
            "{vowData.oath_quote}"
          </blockquote>
        </div>

        {/* Ceremonial Wax Seal Interactive Button */}
        <div className="my-8 flex flex-col items-center justify-center">
          <button
            onClick={handlePressSeal}
            disabled={isStamped}
            className={`relative w-36 h-36 rounded-full bg-radial-parchment border-4 border-gold-500 shadow-seal flex items-center justify-center transition-all duration-300 ${
              isStamped ? 'animate-stamp-seal ring-8 ring-gold-500/50' : 'hover:scale-105 active:scale-95 cursor-pointer gold-glow-pulse'
            }`}
          >
            <div className={`w-28 h-28 rounded-full bg-seal-pattern border-2 border-gold-400 flex items-center justify-center text-center shadow-inner ${isPressing ? 'scale-90' : ''}`}>
              {isStamped ? (
                <div className="flex flex-col items-center justify-center text-gold-300">
                  <CheckCircle className="w-12 h-12 mb-1 animate-bounce" />
                  <span className="text-xs font-bold font-serif-thai">ประทับตราแล้ว</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-gold-300">
                  <span className="text-3xl font-black font-serif-thai">ส</span>
                  <span className="text-[10px] font-serif-thai mt-0.5 tracking-widest text-gold-400">กดประทับตรา</span>
                </div>
              )}
            </div>
          </button>

          <p className="text-xs font-serif-thai font-semibold text-crimson-800 mt-4">
            {isStamped ? '✨ ปิดผนึกคำสัตย์เรียบร้อยแล้ว!' : '✦ แตะที่ตราประทับสีแดงเพื่อปิดผนึกสัจจะ ✦'}
          </p>
        </div>
      </div>
    </div>
  );
};
