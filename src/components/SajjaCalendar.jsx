import React from 'react';
import { Calendar as CalendarIcon, CheckCircle2, RefreshCw, AlertCircle, Edit3 } from 'lucide-react';

export const SajjaCalendar = ({ vow, checkIns = [], onSelectDate }) => {
  if (!vow) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const startDate = new Date(vow.start_date);
  const endDate = new Date(vow.end_date);

  // Generate date list for the vow's duration
  const days = [];
  const curr = new Date(startDate);
  
  while (curr <= endDate) {
    const dStr = curr.toISOString().split('T')[0];
    days.push({
      dateStr: dStr,
      dayNum: curr.getDate(),
      monthNum: curr.getMonth() + 1,
      dayOfWeek: curr.getDay(),
      isToday: dStr === todayStr,
      isFuture: dStr > todayStr,
      isPast: dStr < todayStr
    });
    curr.setDate(curr.getDate() + 1);
  }

  // Map check-ins by date
  const checkInMap = {};
  checkIns.forEach(c => {
    if (c.vow_id === vow.id) {
      checkInMap[c.check_date] = c;
    }
  });

  const dayNames = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

  return (
    <div className="parchment-card rounded-2xl p-5 border border-gold-600/40 shadow-sm my-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-gold-600/20 pb-3">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-crimson-700" />
          <h3 className="text-lg font-bold font-serif-thai text-crimson-800">
            ปฏิทินสัจจะ (บันทึกสถานะรายวัน)
          </h3>
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-emerald-600 inline-block"></span>
            <span className="text-ink-light">ทำสำเร็จ</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded border-2 border-gold-500 bg-amber-100 inline-block"></span>
            <span className="text-ink-light">ปรับคำสัตย์</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded border-2 border-dashed border-stone-400 bg-stone-100 inline-block"></span>
            <span className="text-ink-light">ยังไม่ได้บันทึก</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded border-2 border-crimson-700 bg-crimson-100 inline-block"></span>
            <span className="text-ink-light font-semibold">วันนี้</span>
          </div>
        </div>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2 text-center">
        {/* Weekday Labels */}
        {dayNames.map((name, idx) => (
          <div key={idx} className="text-xs font-bold text-crimson-800 font-serif-thai py-1">
            {name}
          </div>
        ))}

        {/* Date Cells */}
        {days.map((day) => {
          const checkIn = checkInMap[day.dateStr];
          const status = checkIn?.status;

          let cellStyle = 'bg-parchment-200/60 border border-gold-600/30 text-ink';
          let icon = null;

          if (status === 'completed') {
            cellStyle = 'bg-emerald-600 text-white border-emerald-700 shadow-sm hover:bg-emerald-700';
            icon = <CheckCircle2 className="w-3.5 h-3.5 text-white" />;
          } else if (status === 'adjusted') {
            cellStyle = 'bg-amber-100 border-2 border-gold-500 text-amber-900 shadow-sm hover:bg-amber-200';
            icon = <RefreshCw className="w-3.5 h-3.5 text-gold-700" />;
          } else if (day.isFuture) {
            cellStyle = 'bg-parchment-200/30 border border-stone-300/40 text-stone-400 opacity-40 pointer-events-none';
          } else {
            // Past or today with no check-in yet
            cellStyle = 'bg-stone-50 border-2 border-dashed border-stone-400 text-stone-600 hover:border-crimson-600 hover:bg-crimson-50/50';
            icon = <Edit3 className="w-3 h-3 text-stone-400" />;
          }

          // Special highlight border for Today
          const todayBorder = day.isToday ? 'ring-2 ring-crimson-700 ring-offset-1 font-bold' : '';

          return (
            <button
              key={day.dateStr}
              onClick={() => !day.isFuture && onSelectDate(day.dateStr, checkIn)}
              disabled={day.isFuture}
              className={`relative aspect-square rounded-xl p-1 flex flex-col items-center justify-between transition-all duration-200 group active:scale-95 ${cellStyle} ${todayBorder}`}
              title={
                day.isFuture 
                  ? 'วันที่ยังไม่ถึง' 
                  : checkIn 
                    ? `${day.dateStr}: ${status === 'completed' ? 'ทำสำเร็จ' : 'ปรับคำสัตย์'}` 
                    : `${day.dateStr}: ยังไม่ได้บันทึก (คลิกเพื่อบันทึก)`
              }
            >
              <div className="w-full flex items-center justify-between text-[11px] font-medium px-1">
                <span>{day.dayNum}</span>
                {day.isToday && <span className="w-1.5 h-1.5 rounded-full bg-crimson-600 animate-ping"></span>}
              </div>

              <div className="my-auto flex items-center justify-center">
                {icon}
              </div>

              {/* Note indicator */}
              {checkIn?.note && (
                <div className="w-1.5 h-1.5 rounded-full bg-gold-500 mb-0.5" title="มีบันทึกความรู้สึก"></div>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-ink-faded text-center mt-4">
        💡 สามารถคลิกเลือกวันที่ผ่านมาเพื่อย้อนดู บันทึก หรือปรับแก้ไขคำสัตย์ได้ตลอดเวลา
      </p>
    </div>
  );
};
