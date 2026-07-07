import React, { useState } from 'react';
import { ArrowLeft, Sparkles, MapPin, Users, Shield, Plus, Trash2, CheckCircle } from 'lucide-react';
import { useSajja } from '../context/SajjaContext';
import { SealStampModal } from '../components/SealStampModal';

export const CreateVowPage = ({ onCancel, onCreated }) => {
  const { addVow } = useSajja();

  const [step, setStep] = useState(1);

  // Form states
  const [title, setTitle] = useState('');
  const [oathQuote, setOathQuote] = useState('');
  const [category, setCategory] = useState('สุขภาพและกายภาพ');
  const [frequency, setFrequency] = useState('daily');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Default end date +30 days
  const defaultEnd = new Date();
  defaultEnd.setDate(defaultEnd.getDate() + 30);
  const [endDate, setEndDate] = useState(defaultEnd.toISOString().split('T')[0]);

  // Step 2 states: Milestones & Witnesses
  const [milestones, setMilestones] = useState([
    { title: 'หมุดหมายแรก: รักษาสัจจะต่อเนื่อง 7 วัน', target_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0] },
    { title: 'หมุดหมายกลางทาง: สำเร็จครึ่งทาง 15 วัน', target_date: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0] }
  ]);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');

  const [witnesses, setWitnesses] = useState([]);
  const [newWitnessEmail, setNewWitnessEmail] = useState('');
  const [newWitnessName, setNewWitnessName] = useState('');

  // Step 3 state
  const [showSealModal, setShowSealModal] = useState(false);
  const [createdVowData, setCreatedVowData] = useState(null);

  const categories = [
    'สุขภาพและกายภาพ',
    'สมาธิและจิตใจ',
    'การเรียนรู้และปัญญา',
    'วินัยชีวิตและการงาน',
    'กุศลและทานบารมี'
  ];

  const handleAddMilestone = () => {
    if (!newMilestoneTitle.trim()) return;
    setMilestones([...milestones, {
      title: newMilestoneTitle.trim(),
      target_date: endDate
    }]);
    setNewMilestoneTitle('');
  };

  const handleRemoveMilestone = (index) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleAddWitness = () => {
    if (!newWitnessEmail.trim()) return;
    setWitnesses([...witnesses, {
      email: newWitnessEmail.trim(),
      name: newWitnessName.trim() || newWitnessEmail.split('@')[0]
    }]);
    setNewWitnessEmail('');
    setNewWitnessName('');
  };

  const handleRemoveWitness = (index) => {
    setWitnesses(witnesses.filter((_, i) => i !== index));
  };

  const handleGoToSeal = (e) => {
    e.preventDefault();
    if (!title.trim() || !oathQuote.trim()) {
      alert('กรุณากรอกชื่อสัจจะและคำปฏิญาณให้ครบถ้วน');
      return;
    }

    const draftData = {
      title,
      oath_quote: oathQuote,
      category,
      frequency,
      start_date: startDate,
      end_date: endDate,
      milestones,
      witnesses
    };

    setCreatedVowData(draftData);
    setShowSealModal(true);
  };

  const handleSealComplete = async () => {
    if (createdVowData) {
      const newVow = await addVow(createdVowData);
      setShowSealModal(false);
      onCreated(newVow);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Back Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onCancel}
          className="text-xs text-ink-faded hover:text-crimson-800 flex items-center gap-1 font-serif-thai font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ยกเลิกการตั้งสัจจะ</span>
        </button>

        {/* Stepper Indicator */}
        <div className="flex items-center gap-2 text-xs font-serif-thai font-bold text-crimson-800">
          <span className={`px-2.5 py-0.5 rounded-full border ${step >= 1 ? 'bg-crimson-700 text-gold-300 border-gold-500' : 'bg-parchment-200 text-stone-500'}`}>1. คำสัตย์</span>
          <span>→</span>
          <span className={`px-2.5 py-0.5 rounded-full border ${step >= 2 ? 'bg-crimson-700 text-gold-300 border-gold-500' : 'bg-parchment-200 text-stone-500'}`}>2. หมุดหมาย & พยาน</span>
        </div>
      </div>

      <div className="parchment-card rounded-3xl p-6 sm:p-8 border-2 border-gold-500 shadow-2xl relative">
        <div className="gold-corner-box"></div>

        {/* Header */}
        <div className="text-center mb-8 border-b border-gold-600/20 pb-4">
          <span className="text-xs font-serif-thai px-3 py-1 rounded-full bg-crimson-700/10 text-crimson-800 border border-crimson-700/30">
            พิธีการตั้งคำมั่นสัญญาต่อตนเอง
          </span>
          <h2 className="text-2xl font-bold font-serif-thai text-crimson-800 mt-2">
            {step === 1 ? 'กำหนดชื่อสัจจะและคำปฏิญาณ' : 'วางหมุดหมายและเชิญพยานสัจจะ'}
          </h2>
        </div>

        {step === 1 && (
          <form className="space-y-6">
            {/* Vow Title */}
            <div>
              <label className="block text-sm font-bold font-serif-thai text-crimson-900 mb-1">
                ๑. ชื่อสัจจะ (เป้าหมายที่ตั้งมั่น): *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="เช่น: ตื่นนอน 06:00 น. เพื่อฝึกสมาธิ 20 นาที"
                className="w-full rounded-xl bg-parchment-50 border border-gold-600/50 p-3.5 text-sm font-serif-thai text-ink focus:outline-none focus:border-crimson-700 focus:ring-1 focus:ring-crimson-700 shadow-inner"
                required
              />
            </div>

            {/* Oath Quote */}
            <div>
              <label className="block text-sm font-bold font-serif-thai text-crimson-900 mb-1">
                ๒. คำปฏิญาณ (เหตุผลและเจตนารมณ์ว่า "ทำไมถึงตั้งสัจจะข้อนี้"): *
              </label>
              <textarea
                value={oathQuote}
                onChange={(e) => setOathQuote(e.target.value)}
                placeholder="เขียนประโยคสั้นๆ ย้ำเตือนใจ เช่น: เพื่อสร้างความสงบในจิตใจ ดูแลสุขภาพให้แข็งแรง มีพลังในการทำงาน..."
                rows={3}
                className="w-full rounded-xl bg-parchment-50 border border-gold-600/50 p-3.5 text-sm font-serif-thai italic text-ink focus:outline-none focus:border-crimson-700 focus:ring-1 focus:ring-crimson-700 shadow-inner"
                required
              />
            </div>

            {/* Category & Frequency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold font-serif-thai text-ink mb-1">
                  หมวดหมู่:
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl bg-parchment-50 border border-gold-600/40 p-3 text-xs font-serif-thai text-ink focus:outline-none focus:border-crimson-700"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold font-serif-thai text-ink mb-1">
                  ความถี่ในการบันทึก:
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full rounded-xl bg-parchment-50 border border-gold-600/40 p-3 text-xs font-serif-thai text-ink focus:outline-none focus:border-crimson-700"
                >
                  <option value="daily">ทุกวัน (Daily Check-in)</option>
                  <option value="weekly">ทุกสัปดาห์ (Weekly Goal)</option>
                </select>
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold font-serif-thai text-ink mb-1">
                  วันเริ่มสัจจะ:
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-xl bg-parchment-50 border border-gold-600/40 p-3 text-xs text-ink focus:outline-none focus:border-crimson-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold font-serif-thai text-ink mb-1">
                  วันสิ้นสุดสัจจะ:
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-xl bg-parchment-50 border border-gold-600/40 p-3 text-xs text-ink focus:outline-none focus:border-crimson-700"
                />
              </div>
            </div>

            {/* Next Step Button */}
            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (!title.trim() || !oathQuote.trim()) {
                    alert('กรุณากรอกชื่อสัจจะและคำปฏิญาณก่อนไปขั้นตอนถัดไป');
                    return;
                  }
                  setStep(2);
                }}
                className="px-6 py-3 rounded-xl bg-crimson-700 hover:bg-crimson-800 text-gold-300 font-bold font-serif-thai text-sm shadow-md border border-gold-500/40 flex items-center gap-2"
              >
                <span>ต่อไป: ตั้งหมุดหมายและพยาน →</span>
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="space-y-6">
            {/* Milestones Section */}
            <div>
              <label className="block text-sm font-bold font-serif-thai text-crimson-900 mb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-crimson-700" />
                <span>กำหนดหมุดหมายย่อย (จุดพักระหว่างทาง):</span>
              </label>

              <div className="space-y-2 mb-3">
                {milestones.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-parchment-100 rounded-xl border border-gold-600/30 text-xs">
                    <span className="font-serif-thai font-semibold text-ink">{idx + 1}. {m.title}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestone(idx)}
                      className="text-stone-400 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Milestone form */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMilestoneTitle}
                  onChange={(e) => setNewMilestoneTitle(e.target.value)}
                  placeholder="เพิ่มชื่อหมุดหมาย เช่น: ผ่านสัปดาห์แรก"
                  className="flex-1 rounded-xl bg-parchment-50 border border-gold-600/40 p-2.5 text-xs text-ink focus:outline-none focus:border-crimson-700"
                />
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="px-4 py-2.5 rounded-xl bg-gold-600 hover:bg-gold-700 text-parchment-100 text-xs font-serif-thai font-bold flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>เพิ่มหมุด</span>
                </button>
              </div>
            </div>

            {/* Witnesses Section */}
            <div className="pt-4 border-t border-gold-600/20">
              <label className="block text-sm font-bold font-serif-thai text-crimson-900 mb-2 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-crimson-700" />
                <span>พยานสัจจะ (เชิญกัลยาณมิตรร่วมรับรู้คำสัตย์):</span>
              </label>

              {witnesses.map((w, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-xl border border-emerald-300 text-xs mb-2">
                  <span className="font-serif-thai text-emerald-900">👥 {w.name} ({w.email})</span>
                  <button type="button" onClick={() => handleRemoveWitness(idx)} className="text-stone-400 hover:text-rose-700 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                <input
                  type="email"
                  value={newWitnessEmail}
                  onChange={(e) => setNewWitnessEmail(e.target.value)}
                  placeholder="อีเมลพยาน (friend@email.com)"
                  className="rounded-xl bg-parchment-50 border border-gold-600/40 p-2.5 text-xs text-ink focus:outline-none focus:border-crimson-700"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newWitnessName}
                    onChange={(e) => setNewWitnessName(e.target.value)}
                    placeholder="ชื่อพยาน"
                    className="flex-1 rounded-xl bg-parchment-50 border border-gold-600/40 p-2.5 text-xs text-ink focus:outline-none focus:border-crimson-700"
                  />
                  <button
                    type="button"
                    onClick={handleAddWitness}
                    className="px-3 py-2.5 rounded-xl bg-gold-600 hover:bg-gold-700 text-parchment-100 text-xs font-serif-thai font-bold"
                  >
                    เชิญพยาน
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="pt-6 border-t border-gold-600/20 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl text-xs text-ink-faded hover:bg-parchment-300 font-serif-thai font-bold"
              >
                ← ย้อนกลับ
              </button>

              <button
                type="button"
                onClick={handleGoToSeal}
                className="px-6 py-3 rounded-xl bg-crimson-700 hover:bg-crimson-800 text-gold-300 font-bold font-serif-thai text-sm shadow-xl border border-gold-400 flex items-center gap-2 hover:scale-105 transition-all gold-glow-pulse"
              >
                <Sparkles className="w-5 h-5 text-gold-400" />
                <span>เข้าสู่ขั้นตอนประทับตราปิดผนึก ✦</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Seal Animation Modal */}
      {showSealModal && createdVowData && (
        <SealStampModal
          isOpen={showSealModal}
          vowData={createdVowData}
          onSealComplete={handleSealComplete}
        />
      )}
    </div>
  );
};
