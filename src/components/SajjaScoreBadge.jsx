import React from 'react';
import { ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

export const SajjaScoreBadge = ({ score }) => {
  const getScoreMeta = (s) => {
    if (s >= 90) return { title: 'สัจจะบารมีสูงส่ง', color: 'text-amber-800', badgeBg: 'bg-amber-100 border-amber-400', desc: 'คุณเป็นผู้รักษาคำมั่นสัญญาต่อตนเองอย่างเคร่งครัดและเที่ยงแท้' };
    if (s >= 75) return { title: 'ซื่อตรงต่อคำสัตย์', color: 'text-crimson-800', badgeBg: 'bg-crimson-100 border-crimson-400', desc: 'คุณรักษาสัจจะส่วนใหญ่ได้ดี มีความซื่อสัตย์เมื่อเผชิญข้อจำกัด' };
    if (s >= 50) return { title: 'ตั้งมั่นและปรับปรุง', color: 'text-amber-700', badgeBg: 'bg-amber-50 border-amber-300', desc: 'มีความตั้งใจจริง สามารถใช้ปุ่มปรับคำสัตย์เพื่อสร้างกุศโลบายที่เหมาะกับชีวิต' };
    return { title: 'เริ่มต้นฝึกบำเพ็ญ', color: 'text-amber-900', badgeBg: 'bg-stone-100 border-stone-300', desc: 'เริ่มต้นสัจจะข้อเล็กๆ เพื่อสะสมดัชนีความซื่อสตรงให้เติบโต' };
  };

  const meta = getScoreMeta(score);

  return (
    <div className="parchment-card rounded-2xl p-5 border-2 border-gold-500/50 shadow-parchment relative overflow-hidden">
      {/* Decorative Thai Corner Line */}
      <div className="gold-corner-box"></div>
      
      <div className="flex flex-col sm:flex-row items-center gap-5">
        {/* Radial Score Circle */}
        <div className="relative flex-shrink-0">
          <div className="w-24 h-24 rounded-full bg-radial-parchment border-4 border-crimson-700 flex items-center justify-center shadow-seal">
            <div className="text-center">
              <span className="text-3xl font-extrabold font-serif-thai text-crimson-800 tracking-tight">{score}</span>
              <span className="text-xs text-gold-700 block font-serif-thai -mt-1">%</span>
            </div>
          </div>
          {/* Orbiting Sparkle */}
          <div className="absolute -top-1 -right-1 bg-gold-500 text-parchment-100 p-1.5 rounded-full border border-white shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        {/* Info details */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <h2 className="text-xl font-bold font-serif-thai text-crimson-800">{meta.title}</h2>
            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${meta.badgeBg}`}>
              ดัชนีสัจจะ
            </span>
          </div>
          <p className="text-sm text-ink-light leading-relaxed mb-2">{meta.desc}</p>
          <div className="text-xs text-ink-faded flex items-center justify-center sm:justify-start gap-1.5">
            <ShieldCheck className="w-4 h-4 text-gold-600" />
            <span>คำนวณจากอัตราการทำตามคำสัตย์ + การรักษาความซื่อสตรงในการปรับคำสัตย์</span>
          </div>
        </div>
      </div>
    </div>
  );
};
