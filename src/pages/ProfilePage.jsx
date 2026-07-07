import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Flame, Award, Calendar, Sparkles, Database, Check } from 'lucide-react';
import { useSajja } from '../context/SajjaContext';
import { useAuth } from '../context/AuthContext';
import { SajjaScoreBadge } from '../components/SajjaScoreBadge';
import { SealGrid } from '../components/SealGrid';
import { UserAvatar } from '../components/UserAvatar';

export const ProfilePage = ({ onOpenSupabaseConfig }) => {
  const { vows, checkIns, sajjaScore, currentStreak, seals } = useSajja();
  const { user, isDemoMode } = useAuth();

  // Custom avatar crop states
  const [avatarImage, setAvatarImage] = useState(() => localStorage.getItem('sajja_custom_avatar') || '');
  const [srcImage, setSrcImage] = useState(null); // stores raw uploaded image for cropping
  const [scale, setScale] = useState(1);
  const [xOffset, setXOffset] = useState(0);
  const [yOffset, setYOffset] = useState(0);

  const canvasRef = useRef(null);

  // Load uploaded image into crop editor modal
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setSrcImage(event.target.result);
      // Reset sliders for new crop session
      setScale(1.2);
      setXOffset(0);
      setYOffset(0);
    };
    reader.readAsDataURL(file);
    // Clear value to allow choosing the same file again
    e.target.value = '';
  };

  // Redraw preview canvas in real-time when sliders change
  useEffect(() => {
    if (!srcImage || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = srcImage;
    img.onload = () => {
      const size = 200;
      ctx.clearRect(0, 0, size, size);
      
      // Draw white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, size, size);

      // Fit-cover calculation
      const imgRatio = img.width / img.height;
      let drawWidth, drawHeight;
      if (imgRatio > 1) {
        drawHeight = size;
        drawWidth = size * imgRatio;
      } else {
        drawWidth = size;
        drawHeight = size / imgRatio;
      }

      // Apply zoom scale
      const scaledWidth = drawWidth * scale;
      const scaledHeight = drawHeight * scale;

      // Center the image, then apply offsets
      const translateX = (size - scaledWidth) / 2 + xOffset;
      const translateY = (size - scaledHeight) / 2 + yOffset;

      ctx.drawImage(img, translateX, translateY, scaledWidth, scaledHeight);
    };
  }, [srcImage, scale, xOffset, yOffset]);

  const handleSaveCrop = () => {
    if (!canvasRef.current) return;
    // Export 200x200 square cropped base64 string
    const croppedBase64 = canvasRef.current.toDataURL('image/jpeg', 0.95);
    localStorage.setItem('sajja_custom_avatar', croppedBase64);
    setAvatarImage(croppedBase64);
    setSrcImage(null); // close modal
  };

  const handleClearAvatar = () => {
    localStorage.removeItem('sajja_custom_avatar');
    setAvatarImage('');
  };

  // Aggregate All-Vows Heatmap Calendar for the last 30 days
  const today = new Date();
  const last30Days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    last30Days.push(d.toISOString().split('T')[0]);
  }

  // Count completions on each date across ALL vows
  const dateHeatmap = {};
  last30Days.forEach(dateStr => {
    const dayCheckIns = checkIns.filter(c => c.check_date === dateStr);
    const completedCount = dayCheckIns.filter(c => c.status === 'completed').length;
    const adjustedCount = dayCheckIns.filter(c => c.status === 'adjusted').length;
    dateHeatmap[dateStr] = { completedCount, adjustedCount, total: dayCheckIns.length };
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Profile Header Card */}
      <div className="parchment-card rounded-3xl p-6 sm:p-8 border-2 border-gold-500 shadow-parchment relative">
        <div className="gold-corner-box"></div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <UserAvatar size="lg" className="ring-2 ring-gold-400" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold font-serif-thai text-crimson-800">
                  {user?.user_metadata?.full_name || user?.email || 'ผู้บำเพ็ญสัจจะ'}
                </h2>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isDemoMode ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}>
                  {isDemoMode ? 'Demo User' : 'Supabase Authenticated'}
                </span>
              </div>
              <p className="text-xs text-ink-faded mt-1">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Avatar Configurator */}
      <div className="parchment-card rounded-2xl p-5 border border-gold-600/40 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="flex-shrink-0 flex flex-col items-center gap-2">
          <div className="relative">
            <UserAvatar size="lg" className="ring-4 ring-crimson-800/20" />
          </div>
          <span className="text-xs font-serif-thai text-crimson-800 font-semibold">รูปประจำตัวปัจจุบัน</span>
        </div>

        <div className="flex-1 w-full space-y-4">
          <div>
            <h3 className="text-lg font-bold font-serif-thai text-crimson-800">อัปโหลดรูปภาพประจำตัว</h3>
            <p className="text-xs text-ink-faded mt-0.5">เลือกรูปภาพของคุณเพื่อเข้าสู่ขั้นตอนการครอปปรับตำแหน่งก่อนนำไปแสดงผลจริง</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-xs text-ink file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-crimson-700 file:text-gold-300 hover:file:bg-crimson-800 cursor-pointer"
              />
            </div>

            {avatarImage && (
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={handleClearAvatar}
                  className="px-3.5 py-2 rounded-lg bg-rose-100 hover:bg-rose-200 border border-rose-300 text-rose-800 text-xs font-serif-thai font-semibold transition-colors"
                >
                  ล้างรูปภาพโปรไฟล์
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Avatar Image Cropper Modal */}
      {srcImage && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="parchment-card w-full max-w-md rounded-3xl p-6 border-2 border-gold-500 shadow-2xl relative">
            <div className="gold-corner-box"></div>

            <div className="text-center mb-4">
              <span className="text-xs font-serif-thai px-3 py-1 rounded-full bg-crimson-700/10 text-crimson-800 border border-crimson-700/30">
                ขั้นตอนการครอปจัดตำแหน่งรูปภาพ
              </span>
              <h3 className="text-lg font-bold font-serif-thai text-crimson-800 mt-2">
                เลื่อนและขยายภาพให้ได้สัดส่วนที่ต้องการ
              </h3>
            </div>

            {/* Real-time Canvas Preview Circle */}
            <div className="my-6 flex justify-center">
              <canvas 
                ref={canvasRef} 
                width="200" 
                height="200" 
                className="rounded-full border-4 border-gold-500 shadow-lg bg-white"
              />
            </div>

            {/* Editing Sliders */}
            <div className="space-y-4 mb-6">
              {/* Zoom Slider */}
              <div>
                <div className="flex justify-between text-xs text-ink font-semibold mb-1">
                  <span>ย่อขยาย (Zoom):</span>
                  <span className="font-mono text-crimson-800 font-bold">{scale.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="4"
                  step="0.05"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-parchment-300 rounded-lg appearance-none cursor-pointer accent-crimson-700"
                />
              </div>

              {/* X Offset Slider */}
              <div>
                <div className="flex justify-between text-xs text-ink font-semibold mb-1">
                  <span>ขยับแนวนอน (X Offset):</span>
                  <span className="font-mono text-crimson-800 font-bold">{xOffset}px</span>
                </div>
                <input
                  type="range"
                  min="-200"
                  max="200"
                  step="1"
                  value={xOffset}
                  onChange={(e) => setXOffset(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-parchment-300 rounded-lg appearance-none cursor-pointer accent-crimson-700"
                />
              </div>

              {/* Y Offset Slider */}
              <div>
                <div className="flex justify-between text-xs text-ink font-semibold mb-1">
                  <span>ขยับแนวตั้ง (Y Offset):</span>
                  <span className="font-mono text-crimson-800 font-bold">{yOffset}px</span>
                </div>
                <input
                  type="range"
                  min="-200"
                  max="200"
                  step="1"
                  value={yOffset}
                  onChange={(e) => setYOffset(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-parchment-300 rounded-lg appearance-none cursor-pointer accent-crimson-700"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 border-t border-gold-600/20 pt-4">
              <button
                type="button"
                onClick={() => setSrcImage(null)}
                className="px-4 py-2 text-xs text-ink-faded hover:bg-parchment-300 font-serif-thai"
              >
                ยกเลิก
              </button>

              <button
                type="button"
                onClick={handleSaveCrop}
                className="px-5 py-2.5 rounded-lg bg-crimson-700 hover:bg-crimson-800 text-gold-300 text-xs font-bold font-serif-thai shadow border border-gold-500/40 flex items-center gap-1.5 transition-transform active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>บันทึกรูปภาพ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sajja Score Breakdown */}
      <SajjaScoreBadge score={sajjaScore} />

      {/* OVERALL HEATMAP CALENDAR */}
      <div className="parchment-card rounded-2xl p-5 border border-gold-600/40 shadow-sm">
        <div className="flex items-center justify-between border-b border-gold-600/20 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-crimson-700" />
            <h3 className="text-lg font-bold font-serif-thai text-crimson-800">
              ภาพรวมบันทึกรวมทุกสัจจะ (Heatmap 30 วันย้อนหลัง)
            </h3>
          </div>
          <span className="text-xs text-ink-faded font-serif-thai">
            มองเห็นแพทเทิร์นความซื่อสตรงในภาพรวม
          </span>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
          {last30Days.map((dateStr) => {
            const data = dateHeatmap[dateStr];
            let bgCls = 'bg-stone-100 border-stone-200 text-stone-400';
            if (data.completedCount > 0) {
              bgCls = 'bg-emerald-600 text-white border-emerald-700 font-bold';
            } else if (data.adjustedCount > 0) {
              bgCls = 'bg-amber-100 border-2 border-gold-500 text-amber-900 font-bold';
            }

            const dayNum = dateStr.split('-')[2];
            return (
              <div
                key={dateStr}
                className={`p-2 rounded-xl text-center border text-xs flex flex-col items-center justify-between aspect-square ${bgCls}`}
                title={`${dateStr}: สำเร็จ ${data.completedCount} สัจจะ, ปรับคำสัตย์ ${data.adjustedCount} สัจจะ`}
              >
                <span className="text-[10px] opacity-80">{dayNum}</span>
                <span className="text-[11px]">
                  {data.completedCount > 0 ? `✓${data.completedCount}` : data.adjustedCount > 0 ? `✕${data.adjustedCount}` : '-'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SEALS GRID */}
      <SealGrid seals={seals} />

      {/* Complete Vow History */}
      <div className="parchment-card rounded-2xl p-5 border border-gold-600/40 shadow-sm">
        <h3 className="text-lg font-bold font-serif-thai text-crimson-800 mb-4 border-b border-gold-600/20 pb-3">
          ประวัติการตั้งสัจทั้งหมด ({vows.length})
        </h3>

        <div className="space-y-3">
          {vows.map((vow) => (
            <div key={vow.id} className="p-4 bg-parchment-100 rounded-xl border border-gold-600/30 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-crimson-800 font-serif-thai text-sm block">{vow.title}</span>
                <span className="text-ink-faded italic">"{vow.oath_quote}"</span>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <span className="px-2.5 py-0.5 rounded-full bg-crimson-700/10 text-crimson-800 font-serif-thai font-bold block mb-1">
                  {vow.category}
                </span>
                <span className="text-ink-faded text-[11px]">{vow.start_date} ~ {vow.end_date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
