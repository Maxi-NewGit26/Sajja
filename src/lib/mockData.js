export const initialVows = [
  {
    id: 'vow-1',
    user_id: 'user-demo',
    title: 'ฝึกสมาธิเจริญสติ 20 นาทีทุกเช้า',
    oath_quote: 'เพื่อสร้างความสงบภายในจิตใจ รู้เท่าทันอารมณ์ และไม่ใช้อารมณ์ตัดสินปัญหาในชีวิตประจำวัน',
    category: 'สมาธิและจิตใจ',
    frequency: 'daily',
    start_date: '2026-07-01',
    end_date: '2026-07-30',
    status: 'active',
    seal_color: 'crimson',
    created_at: '2026-07-01T06:00:00Z',
    milestones: [
      { id: 'm1', vow_id: 'vow-1', title: 'ปฐมหมุดหมาย: ต่อเนื่องครบ 7 วัน', target_date: '2026-07-07', is_completed: true, completed_at: '2026-07-07' },
      { id: 'm2', vow_id: 'vow-1', title: 'มัชฌิมหมุดหมาย: นั่งสมาธิครบ 15 วัน', target_date: '2026-07-15', is_completed: false },
      { id: 'm3', vow_id: 'vow-1', title: 'ปัจฉิมหมุดหมาย: บรรลุสัจจะ 30 วันเต็ม', target_date: '2026-07-30', is_completed: false }
    ],
    witnesses: [
      { id: 'w1', vow_id: 'vow-1', witness_email: 'friend@sajja.app', witness_name: 'กัลยาณมิตร สมศักดิ์', status: 'accepted' }
    ]
  },
  {
    id: 'vow-2',
    user_id: 'user-demo',
    title: 'งดเครื่องดื่มหวานและน้ำตาลสะสม',
    oath_quote: 'เพื่อดูแลเรือนร่างที่พ่อแม่ให้มา มีสุขภาพที่แข็งแรง มีพลังงานลุยงานอย่างสดชื่น',
    category: 'สุขภาพและกายภาพ',
    frequency: 'daily',
    start_date: '2026-07-01',
    end_date: '2026-07-21',
    status: 'active',
    seal_color: 'gold',
    created_at: '2026-07-01T08:00:00Z',
    milestones: [
      { id: 'm4', vow_id: 'vow-2', title: 'ล้างพิษน้ำตาล 3 วันแรก', target_date: '2026-07-03', is_completed: true, completed_at: '2026-07-03' },
      { id: 'm5', vow_id: 'vow-2', title: 'ผ่านสัปดาห์แรกไร้น้ำตาล', target_date: '2026-07-07', is_completed: true, completed_at: '2026-07-07' },
      { id: 'm6', vow_id: 'vow-2', title: 'ครบสัจจะ 21 วันเปลี่ยนนิสัย', target_date: '2026-07-21', is_completed: false }
    ],
    witnesses: []
  }
];

// Seed check-ins for July 2026 up to today (July 6, 2026)
export const initialCheckIns = [
  // Vow 1 check-ins
  { id: 'c1-1', vow_id: 'vow-1', user_id: 'user-demo', check_date: '2026-07-01', status: 'completed', note: 'ตื่น 06:00 น. นั่งสมาธิรับรุ่งอรุณ รู้สึกจิตใจปลอดโปร่ง' },
  { id: 'c1-2', vow_id: 'vow-1', user_id: 'user-demo', check_date: '2026-07-02', status: 'completed', note: 'สมาธิดี ลมหายใจแผ่วเบา' },
  { id: 'c1-3', vow_id: 'vow-1', user_id: 'user-demo', check_date: '2026-07-03', status: 'adjusted', note: 'เมื่อเช้าติดธุระด่วน เลยปรับคำสัตย์เจริญสติระหว่างเดินทางแทน 15 นาที' },
  { id: 'c1-4', vow_id: 'vow-1', user_id: 'user-demo', check_date: '2026-07-04', status: 'completed', note: 'กลับมาตื่นเช้าตามเดิม จิตใจสงบ' },
  { id: 'c1-5', vow_id: 'vow-1', user_id: 'user-demo', check_date: '2026-07-05', status: 'completed', note: 'นั่งสมาธิครบ 20 นาทีบริบูรณ์' },

  // Vow 2 check-ins
  { id: 'c2-1', vow_id: 'vow-2', user_id: 'user-demo', check_date: '2026-07-01', status: 'completed', note: 'ดื่มชาดำไม่ใส่น้ำตาล ไม่รู้สึกกระหายหวาน' },
  { id: 'c2-2', vow_id: 'vow-2', user_id: 'user-demo', check_date: '2026-07-02', status: 'completed', note: 'ปฏิเสธชานมเพื่อนได้สำเร็จ!' },
  { id: 'c2-3', vow_id: 'vow-2', user_id: 'user-demo', check_date: '2026-07-03', status: 'completed', note: 'ล้างพิษน้ำตาลครบ 3 วัน สดชื่นขึ้น' },
  { id: 'c2-4', vow_id: 'vow-2', user_id: 'user-demo', check_date: '2026-07-04', status: 'adjusted', note: 'เผลอกินผลไม้หวานจัด ปรับคำสัตย์ดื่มน้ำตาม 2 ลิตรเพื่อเจือจาง' },
  { id: 'c2-5', vow_id: 'vow-2', user_id: 'user-demo', check_date: '2026-07-05', status: 'completed', note: 'งดหวานเรียบร้อย' }
];
