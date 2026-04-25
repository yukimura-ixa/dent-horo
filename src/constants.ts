export interface Mission {
  id: string;
  title: string;
  description: string;
  horoscope: string;
  extraInfo: string;
  titleTh?: string;
  descriptionTh?: string;
  horoscopeTh?: string;
  extraInfoTh?: string;
}

export const MISSIONS: Mission[] = [
  {
    id: "m1",
    title: "Mercury Retrograde Rinse",
    titleTh: "บ้วนปากดาวพุธถอยหลัง",
    description: "Rinse your mouth with water after every meal today to keep the cosmic balance.",
    descriptionTh: "บ้วนปากด้วยน้ำเปล่าหลังอาหารทุกมื้อวันนี้ เพื่อรักษาสมดุลจักรวาล",
    horoscope: "Your communications might be fuzzy, but your breath shouldn't be.",
    horoscopeTh: "การสื่อสารของคุณอาจจะคลุมเครือ แต่ลมหายใจต้องสดชื่น",
    extraInfo: "Focus on pH balance.",
    extraInfoTh: "เน้นรักษาสมดุลกรดด่าง"
  },
  {
    id: "m2",
    title: "The Saturn Shine",
    titleTh: "ประกายแห่งดาวเสาร์",
    description: "Brush for a full 3 minutes today instead of 2. Saturn demands discipline.",
    descriptionTh: "แปรงฟันให้ครบ 3 นาทีเต็มในวันนี้ ดาวเสาร์ต้องการความมีวินัย",
    horoscope: "Consistency is key to a long-lasting smile.",
    horoscopeTh: "ความสม่ำเสมอคือกุญแจสำคัญสู่รอยยิ้มที่ยืนยาว",
    extraInfo: "Check for plaque at the gum line.",
    extraInfoTh: "ตรวจคราบพลัคบริเวณคอฟัน"
  },
  {
    id: "m3",
    title: "Venusian Floss",
    titleTh: "ไหมขัดฟันดาวศุกร์",
    description: "Floss your entire mouth before bed. Venus loves beauty.",
    descriptionTh: "ใช้ไหมขัดฟันทำความสะอาดทุกซอกฟันก่อนนอน ดาวศุกร์รักความงดงาม",
    horoscope: "Attract what you want with the cleanest gaps in the galaxy.",
    horoscopeTh: "ดึงดูดสิ่งที่คุณปรารถนาด้วยซอกฟันที่สะอาดที่สุดในกาแล็กซี",
    extraInfo: "Demonstrate proper flossing technique.",
    extraInfoTh: "สาธิตการใช้ไหมขัดฟันอย่างถูกวิธี"
  },
  {
    id: "m4",
    title: "Mars Mandible Massage",
    titleTh: "นวดขากรรไกรดาวอังคาร",
    description: "Gently massage your jaw joints for 5 minutes. Release the warrior's tension.",
    descriptionTh: "นวดข้อต่อขากรรไกรเบาๆ 5 นาที ปลดปล่อยความตึงเครียดของนักรบ",
    horoscope: "Avoid clamping down on stress today.",
    horoscopeTh: "หลีกเลี่ยงการกัดฟันแน่นเมื่อเจอความเครียดในวันนี้",
    extraInfo: "Look for signs of bruxism.",
    extraInfoTh: "สังเกตสัญญาณของการนอนกัดฟัน"
  },
  {
    id: "m5",
    title: "Jupiter's Juice Joy",
    titleTh: "ความสุขหลีกเลี่ยงน้ำหวานดาวพฤหัส",
    description: "Avoid sugary drinks for 24 hours. Expansion should be in your wisdom, not your cavities.",
    descriptionTh: "งดเครื่องดื่มที่มีน้ำตาล 24 ชั่วโมง การขยายตัวควรเกิดกับปัญญา ไม่ใช่รอยผุ",
    horoscope: "Wealth comes to those who protect their white gold (teeth).",
    horoscopeTh: "ความมั่งคั่งจะมาสู่ผู้ที่ปกป้องทองคำสีขาว (ฟัน) ของตนเอง",
    extraInfo: "Discuss acid erosion.",
    extraInfoTh: "พูดคุยเรื่องการกร่อนของกรด"
  },
  {
    id: "m6",
    title: "Lunar Gum Love",
    titleTh: "ดูแลเหงือกด้วยพลังจันทรา",
    description: "Use a soft-bristled brush to gently clean your gums.",
    descriptionTh: "ใช้แปรงสีฟันขนนุ่มทำความสะอาดเหงือกอย่างอ่อนโยน",
    horoscope: "Your sensitivity is your strength today.",
    horoscopeTh: "ความอ่อนโยนคือจุดแข็งของคุณในวันนี้",
    extraInfo: "Inquire about gum bleeding.",
    extraInfoTh: "สอบถามถึงอาการเลือดออกตามไรฟัน"
  },
  {
    id: "m7",
    title: "Solar Sparkle",
    titleTh: "ประกายเจิดจ้าสุริยะ",
    description: "Check your reflection in the sun. Brush away all shadows.",
    descriptionTh: "เช็กเงาสะท้อนฟันกลางแสงแดด แปรงปัดเป่าเงามืดให้หมดไป",
    horoscope: "Radiance starts from within (your mouth).",
    horoscopeTh: "ความเปล่งประกายเริ่มต้นจากภายใน (ช่องปากของคุณ)",
    extraInfo: "Assess whitening needs.",
    extraInfoTh: "ประเมินความต้องการการฟอกขาว"
  },
  {
    id: "m8",
    title: "Neptune's Hydration",
    titleTh: "ชุ่มฉ่ำแบบดาวเนปจูน",
    description: "Drink 8 glasses of water today. Dry mouths are for space dust.",
    descriptionTh: "ดื่มน้ำให้ได้ 8 แก้วในวันนี้ อาการปากแห้งมีไว้สำหรับฝุ่นอวกาศเท่านั้น",
    horoscope: "Flow with the cosmic currents of saliva.",
    horoscopeTh: "ลื่นไหลไปกับกระแสน้ำลายแห่งจักรวาล",
    extraInfo: "Check for dry mouth symptoms.",
    extraInfoTh: "ตรวจหาอาการปากแห้ง"
  },
  {
    id: "m9",
    title: "Uranus Upheaval",
    titleTh: "การเปลี่ยนแปลงดาวยูเรนัส",
    description: "Try a new flavor of toothpaste or a different brushing hand.",
    descriptionTh: "ลองยาสีฟันรสชาติใหม่ หรือเปลี่ยนมือที่ใช้แปรงฟัน",
    horoscope: "Change is coming, embrace the new routine.",
    horoscopeTh: "การเปลี่ยนแปลงกำลังมา จงโอบรับกิจวัตรใหม่ๆ",
    extraInfo: "Discuss habit building.",
    extraInfoTh: "พูดคุยเรื่องการสร้างนิสัย"
  },
  {
    id: "m10",
    title: "Pluto's Deep Clean",
    titleTh: "ทำความสะอาดล้ำลึกดาวพลูโต",
    description: "Clean your tongue thoroughly. Transformation starts at the root.",
    descriptionTh: "ทำความสะอาดลิ้นอย่างละเอียด การเปลี่ยนแปลงเริ่มต้นจากรากฐาน",
    horoscope: "Let go of what no longer serves you (and your breath).",
    horoscopeTh: "ปล่อยวางสิ่งที่ไม่ก่อประโยชน์อีกต่อไป (รวมถึงกลิ่นปากด้วย)",
    extraInfo: "Check for tongue coating.",
    extraInfoTh: "ตรวจดูฝ้าขาวบนลิ้น"
  },
  {
    id: "m11",
    title: "The Starry Scrub",
    titleTh: "แปรงฟันวิถีหมู่ดาว",
    description: "Brush circularly like galaxies spinning in space.",
    descriptionTh: "แปรงฟันเป็นวงกลมเหมือนกาแล็กซีที่หมุนวนในอวกาศ",
    horoscope: "Alignment brings brightness.",
    horoscopeTh: "การจัดแนวที่เหมาะสมนำมาซึ่งความสว่างไสว",
    extraInfo: "Review brushing circular motion.",
    extraInfoTh: "ทบทวนการแปรงฟันแบบวงกลม"
  },
  {
    id: "m12",
    title: "Meteor Mint",
    titleTh: "มินต์อุกกาบาต",
    description: "Enjoy a sugar-free mint after lunch. A quick burst of energy.",
    descriptionTh: "อมลูกอมมินต์ปราศจากน้ำตาลหลังอาหารกลางวันเพื่อความสดชื่นรวดเร็ว",
    horoscope: "A small change creates a massive impact.",
    horoscopeTh: "การเปลี่ยนแปลงเล็กๆ สร้างผลกระทบได้อย่างมหาศาล",
    extraInfo: "Discuss Xylitol benefits.",
    extraInfoTh: "พูดคุยถึงประโยชน์ของไซลิทอล"
  },
  {
    id: "m13",
    title: "Comet Cleaning",
    titleTh: "ทำความสะอาดฉบับดาวหาง",
    description: "Focus on the very back molars today. Don't let them be isolated stars.",
    descriptionTh: "เน้นทำความสะอาดฟันกรามซี่ในสุด อย่าปล่อยให้พวกมันเป็นดวงดาวที่โดดเดี่ยว",
    horoscope: "Reach for the unreachable.",
    horoscopeTh: "จงเอื้อมให้ถึงในสิ่งที่ยากจะเข้าถึง",
    extraInfo: "Check for wisdom tooth health.",
    extraInfoTh: "ตรวจสุขภาพฟันคุด"
  },
  {
    id: "m14",
    title: "Zodiac Zero Sugar",
    titleTh: "จักรราศีไร้น้ำตาล",
    description: "Check labels for hidden sugars today. Be the detective of your health.",
    descriptionTh: "ตรวจสอบฉลากหาน้ำตาลแฝงในวันนี้ จงเป็นนักสืบเพื่อสุขภาพของคุณ",
    horoscope: "Truth will be revealed in the ingredients.",
    horoscopeTh: "ความจริงจะถูกเปิดเผยในส่วนผสม",
    extraInfo: "Educate on sugar substitutes.",
    extraInfoTh: "ให้ความรู้เกี่ยวกับสารให้ความหวานแทนน้ำตาล"
  },
  {
    id: "m15",
    title: "Gravity Gap Guard",
    titleTh: "เกราะป้องกันแรงโน้มถ่วง",
    description: "Ensure you brush the chewing surfaces carefully. Stand your ground.",
    descriptionTh: "แน่ใจว่าได้แปรงด้านบดเคี้ยวอย่างระมัดระวัง ยืนหยัดอย่างมั่นคง",
    horoscope: "Stability is found in the foundations.",
    horoscopeTh: "ความมั่นคงพบได้ในรากฐาน",
    extraInfo: "Check for occlusal decay.",
    extraInfoTh: "ตรวจหาฟันผุด้านบดเคี้ยว"
  },
  {
    id: "m16",
    title: "Nebula Night Routine",
    titleTh: "กิจวัตรเนบิวลาก่อนนอน",
    description: "Don't skip the night brush. The stars are watching.",
    descriptionTh: "ห้ามข้ามการแปรงฟันก่อนนอน ดวงดาวกำลังเฝ้ามองอยู่",
    horoscope: "Rest is when the magic happens.",
    horoscopeTh: "การพักผ่อนคือจุดเริ่มต้นของเวทมนตร์",
    extraInfo: "Explain nighttime acid buildup.",
    extraInfoTh: "อธิบายเรื่องการสะสมกรดตอนกลางคืน"
  },
  {
    id: "m17",
    title: "Asteroid Attack",
    titleTh: "ป้องกันดาวเคราะห์น้อยพุ่งชน",
    description: "Avoid snacking between meals today. Limit the impacts.",
    descriptionTh: "งดกินจุบจิบระหว่างมื้อในวันนี้ จำกัดผลกระทบต่อฟัน",
    horoscope: "Space out your intake for maximum protection.",
    horoscopeTh: "เว้นระยะการกินเพื่อการปกป้องสูงสุด",
    extraInfo: "Explain snacking frequency vs decay.",
    extraInfoTh: "อธิบายความถี่ในการกินขนมกับการเกิดฟันผุ"
  },
  {
    id: "m18",
    title: "Galactic Gurgle",
    titleTh: "กลั้วปากอวกาศ",
    description: "Use an alcohol-free mouthwash for 30 seconds.",
    descriptionTh: "ใช้น้ำยาบ้วนปากไร้แอลกอฮอล์นาน 30 วินาที",
    horoscope: "Cleanse your aura and your mouth.",
    horoscopeTh: "ชำระล้างออร่าและช่องปากของคุณ",
    extraInfo: "Check for mouthwash preference.",
    extraInfoTh: "ตรวจสอบความชอบของน้ำยาบ้วนปาก"
  },
  {
    id: "m19",
    title: "Constellation Check",
    titleTh: "เช็กกลุ่มดาว",
    description: "Look in the mirror and count all your teeth. Know your team.",
    descriptionTh: "ส่องกระจกและนับฟันทุกซี่ รู้จักทีมเวิร์กของคุณ",
    horoscope: "Self-awareness is the first step to mastery.",
    horoscopeTh: "การรู้จักตัวเองคือก้าวแรกสู่ความเชี่ยวชาญ",
    extraInfo: "Patient education on tooth anatomy.",
    extraInfoTh: "ให้ความรู้คนไข้เกี่ยวกับกายวิภาคฟัน"
  },
  {
    id: "m20",
    title: "Supernova Strength",
    titleTh: "ความแข็งแกร่งของซูเปอร์โนวา",
    description: "Eat something rich in Calcium today (cheese, yogurt, or greens).",
    descriptionTh: "ทานอาหารที่มีแคลเซียมสูงวันนี้ (ชีส, โยเกิร์ต, หรือผักใบเขียว)",
    horoscope: "Power up your shells.",
    horoscopeTh: "เพิ่มพลังให้เกราะเพชรของคุณ",
    extraInfo: "Discuss remineralization.",
    extraInfoTh: "พูดคุยเรื่องการคืนแร่ธาตุสู่ผิวฟัน"
  },
  {
    id: "m21",
    title: "Binary Brush",
    titleTh: "แปรงฟันระบบดาวคู่",
    description: "Brush with a partner or friend. Collective energy is stronger.",
    descriptionTh: "แปรงฟันพร้อมกับคนรักหรือเพื่อน พลังที่รวมกันย่อมแข็งแกร่งกว่า",
    horoscope: "Connections bring joy and accountability.",
    horoscopeTh: "ความสัมพันธ์นำมาซึ่งความสุขและความรับผิดชอบร่วมกัน",
    extraInfo: "Discuss monitoring for kids/family.",
    extraInfoTh: "พูดคุยเรื่องดูแลสุขภาพฟันของเด็ก/ครอบครัว"
  },
  {
    id: "m22",
    title: "Eclipse Enamel",
    titleTh: "เคลือบฟันสุริยุปราคา",
    description: "Avoid acidic foods (lemons, sodas) for 12 hours.",
    descriptionTh: "หลีกเลี่ยงอาหารที่มีความเป็นกรดสูง (มะนาว, น้ำอัดลม) 12 ชั่วโมง",
    horoscope: "Protection is better than repair.",
    horoscopeTh: "การปกป้องดีกว่าการซ่อมแซม",
    extraInfo: "Check for enamel wear.",
    extraInfoTh: "รับประกันการสึกของเคลือบฟัน"
  },
  {
    id: "m23",
    title: "Orion's Observation",
    titleTh: "การสังเกตการณ์ของนายพราน",
    description: "Schedule your next dental checkup or clean your brush holder.",
    descriptionTh: "นัดหมายตรวจฟันครั้งต่อไป หรือทำความสะอาดที่ใส่แปรงสีฟัน",
    horoscope: "The hunter always prepares for the future.",
    horoscopeTh: "ผู้ล่าย่อมเตรียมพร้อมสำหรับอนาคตเสมอ",
    extraInfo: "Administrative follow-up.",
    extraInfoTh: "ติดตามผลทางธุรการ"
  }
];
