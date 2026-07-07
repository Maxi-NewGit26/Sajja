/**
  Sajja Score & Seals Calculation Logic
*/

export const calculateSajjaScore = (vows = [], checkIns = []) => {
  if (!vows || vows.length === 0) return 100;

  let totalPlannedDays = 0;
  let totalWeightedFulfillment = 0;

  vows.forEach((vow) => {
    const vowCheckIns = checkIns.filter((c) => c.vow_id === vow.id);
    vowCheckIns.forEach((checkIn) => {
      totalPlannedDays += 1;
      if (checkIn.status === 'completed') {
        totalWeightedFulfillment += 1;
      } else if (checkIn.status === 'adjusted') {
        // Adjusting vow (ปรับคำสัตย์) awards 0.75 points (honest reflection)
        totalWeightedFulfillment += 0.75;
      } else { // missed
        totalWeightedFulfillment += 0;
      }
    });
  });

  if (totalPlannedDays === 0) return 100;

  const scoreRatio = totalWeightedFulfillment / totalPlannedDays;
  const rawScore = Math.round(scoreRatio * 100);
  return Math.min(100, Math.max(0, rawScore));
};

export const calculateStreak = (checkIns = []) => {
  if (!checkIns || checkIns.length === 0) return 0;

  // Group check-ins by date
  const dateMap = {};
  checkIns.forEach((c) => {
    if (c.status === 'completed' || c.status === 'adjusted') {
      dateMap[c.check_date] = true;
    }
  });

  const dates = Object.keys(dateMap).sort().reverse(); // Sort descending
  if (dates.length === 0) return 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // If haven't checked in today or yesterday, streak might be broken
  if (!dateMap[todayStr] && !dateMap[yesterdayStr]) {
    return 0;
  }

  let streak = 0;
  let currentDate = dateMap[todayStr] ? new Date() : yesterday;

  while (true) {
    const dateStr = currentDate.toISOString().split('T')[0];
    if (dateMap[dateStr]) {
      streak += 1;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

export const evaluateUnlockedSeals = (vows = [], checkIns = [], witnesses = []) => {
  const streak = calculateStreak(checkIns);
  const score = calculateSajjaScore(vows, checkIns);
  const totalVows = vows.length;
  const totalWitnesses = witnesses.length;

  const seals = [
    {
      id: 'bronze_first',
      seal_type: 'bronze',
      title: 'ตราสัมฤทธิ์แรกเริ่ม',
      description: 'ประทับตราปฐมสัจจะข้อแรกสำเร็จ มอบให้แก่ผู้เริ่มสัจจะบารมี',
      icon_name: 'ShieldCheck',
      unlocked: totalVows > 0,
      unlocked_at: totalVows > 0 ? 'ปลดล็อกแล้ว' : 'สร้างสัจจะข้อแรก'
    },
    {
      id: 'silver_streak_7',
      seal_type: 'silver',
      title: 'ตราสัจจะเงิน (7 วัน)',
      description: 'รักษาคำสัตย์ต่อเนื่องกันครบ 7 วัน โดยไม่ขาดสายสัจจะ',
      icon_name: 'Award',
      unlocked: streak >= 7,
      unlocked_at: streak >= 7 ? 'ปลดล็อกแล้ว' : `ขาดอีก ${Math.max(0, 7 - streak)} วัน`
    },
    {
      id: 'gold_streak_30',
      seal_type: 'gold',
      title: 'ตราสัจจะทองคำ (30 วัน)',
      description: 'บำเพ็ญสัจจะต่อเนื่องครบ 30 วัน สัจจะบารมีสว่างไสว',
      icon_name: 'Crown',
      unlocked: streak >= 30,
      unlocked_at: streak >= 30 ? 'ปลดล็อกแล้ว' : `ขาดอีก ${Math.max(0, 30 - streak)} วัน`
    },
    {
      id: 'sacred_witness',
      seal_type: 'witness',
      title: 'ตราพยานศักดิ์สิทธิ์',
      description: 'เชิญพยานรับรู้คำสัตย์ เพิ่มแรงซื่อตรงร่วมกัน',
      icon_name: 'Users',
      unlocked: totalWitnesses > 0,
      unlocked_at: totalWitnesses > 0 ? 'ปลดล็อกแล้ว' : 'เชิญพยานสัจจะ 1 คน'
    },
    {
      id: 'gold_score_90',
      seal_type: 'gold',
      title: 'ตรามหาศรัทธา (Sajja Score 90+)',
      description: 'รักษารักษาดัชนีสัจจะสูงเกิน 90% แสดงถึงความซื่อสตรงสูงสุด',
      icon_name: 'Sparkles',
      unlocked: score >= 90 && totalVows > 0,
      unlocked_at: score >= 90 && totalVows > 0 ? 'ปลดล็อกแล้ว' : 'ทำ Sajja Score ให้ถึง 90%'
    }
  ];

  return seals;
};
