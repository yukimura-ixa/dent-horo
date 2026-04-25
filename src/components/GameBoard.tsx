import { useState, useEffect } from 'react';
import { doc, getDoc, runTransaction } from 'firebase/firestore';
import { db } from '../firebase';
import liff from '@line/liff';
import { motion, AnimatePresence } from 'motion/react';
import { MISSIONS, Mission } from '../constants';
import { Sparkles, Share, RefreshCcw } from 'lucide-react';

interface GameBoardProps {
  userProfile: { displayName: string, userId: string };
}

export default function GameBoard({ userProfile }: GameBoardProps) {
  const [lang, setLang] = useState<'th' | 'en'>('th');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Game states
  const [hasDrawnToday, setHasDrawnToday] = useState(false);
  const [mission, setMission] = useState<Mission | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [availableCount, setAvailableCount] = useState<number>(23);

  const getTodayStr = () => new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadGameState();
  }, [userProfile.userId]);

  const loadGameState = async () => {
    try {
      const today = getTodayStr();
      const userRef = doc(db, 'users', userProfile.userId);
      const deckRef = doc(db, 'daily_decks', today);

      const [userSnap, deckSnap] = await Promise.all([getDoc(userRef), getDoc(deckRef)]);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.lastPickedDate === today && userData.lastMissionId) {
          setHasDrawnToday(true);
          const drawnMission = MISSIONS.find(m => m.id === userData.lastMissionId);
          if (drawnMission) setMission(drawnMission);
        }
      }

      if (deckSnap.exists()) {
        const deckData = deckSnap.data();
        setAvailableCount(23 - (deckData.pickedCardIds?.length || 0));
      } else {
        setAvailableCount(23);
      }

    } catch (err: any) {
      console.error(err);
      setError('Failed to load game state.');
    } finally {
      setLoading(false);
    }
  };

  const drawCard = async () => {
    setDrawing(true);
    setError(null);
    try {
      const today = getTodayStr();
      const userRef = doc(db, 'users', userProfile.userId);
      const deckRef = doc(db, 'daily_decks', today);

      const drawnMissionResult = await runTransaction(db, async (transaction) => {
        const userSnap = await transaction.get(userRef);
        const deckSnap = await transaction.get(deckRef);

        const userData = userSnap.exists() ? userSnap.data() : {
          displayName: userProfile.displayName,
          pickedCardsHistory: [],
          lastPickedDate: '',
          lastMissionId: ''
        };

        if (userData.lastPickedDate === today) {
          throw new Error('You already drew a card today!');
        }

        let deckData: { date: string, pickedCardIds: string[] } = {
          date: today,
          pickedCardIds: []
        };

        if (deckSnap.exists()) {
          deckData = deckSnap.data() as any;
          // Global Reset if full
          if (deckData.pickedCardIds.length >= 23) {
            deckData.pickedCardIds = [];
          }
        }

        // Calculate available cards for this user
        const allIds = MISSIONS.map(m => m.id);
        const globalAvailable = allIds.filter(id => !deckData.pickedCardIds.includes(id));
        let userAvailable = globalAvailable.filter(id => !userData.pickedCardsHistory.includes(id));

        // If user has seen all currently global available cards, 
        // we might need to reset their personal history if they've seen all 23.
        if (userData.pickedCardsHistory.length >= 23) {
           userData.pickedCardsHistory = [];
           userAvailable = globalAvailable;
        } else if (userAvailable.length === 0) {
           // Edge case: user has drawn some cards, and the only cards left in the global pool today are ones they already drew.
           // To prevent deadlock without resetting global early, we just let them draw from global anyway but don't add to personal uniqueness limit.
           userAvailable = globalAvailable;
        }

        // Pick a random card
        const randomIndex = Math.floor(Math.random() * userAvailable.length);
        const pickedId = userAvailable[randomIndex];

        // Update history
        const newHistory = [...userData.pickedCardsHistory, pickedId];
        const newDeckPicked = [...deckData.pickedCardIds, pickedId];

        // Update Deck
        if (!deckSnap.exists() || deckData.pickedCardIds.length === 0) {
          transaction.set(deckRef, { date: today, pickedCardIds: newDeckPicked });
        } else {
          transaction.update(deckRef, { pickedCardIds: newDeckPicked });
        }

        // Update User
        transaction.update(userRef, {
          displayName: userProfile.displayName,
          pickedCardsHistory: newHistory,
          lastPickedDate: today,
          lastMissionId: pickedId
        });

        return MISSIONS.find(m => m.id === pickedId);
      });

      if (drawnMissionResult) {
        setMission(drawnMissionResult);
        setHasDrawnToday(true);
        setAvailableCount(prev => (prev === 1 ? 23 : prev - 1));
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'The cosmos rejected your draw. Try again.');
    } finally {
      setDrawing(false);
    }
  };

  const shareToChat = async (targetType: 'picker' | 'current' = 'picker') => {
    if (!liff.isLoggedIn() || !mission) return;
    try {
      const shareText = lang === 'th' 
        ? `✨ My Dental Horoscope ✨\n\nหัวข้อ: ${mission.titleTh}\nคำทำนาย: ${mission.horoscopeTh}\nภารกิจ: ${mission.descriptionTh}` 
        : `✨ My Dental Horoscope ✨\n\nTitle: ${mission.title}\nHoroscope: ${mission.horoscope}\nMission: ${mission.description}`;

      if (targetType === 'picker' && liff.isApiAvailable('shareTargetPicker')) {
        await liff.shareTargetPicker([
          {
            type: 'text',
            text: shareText
          }
        ]);
      } else {
        await liff.sendMessages([
          {
            type: 'text',
            text: shareText
          }
        ]);
        if (targetType === 'picker') {
           liff.closeWindow();
        } else {
           alert(lang === 'th' ? 'ส่งข้อความสำเร็จ!' : 'Message sent to the current chat!');
        }
      }
    } catch (err) {
      console.error('Failed to send message', err);
      // Fallback
      alert(lang === 'th' ? 'ไม่สามารถส่งข้อความได้ กรุณาเปิดผ่านแอป LINE' : 'Could not share to chat. Please ensure you opened this via the LINE app and have granted the necessary permissions.');
    }
  };

  if (loading) {
     return <div className="p-8 text-center animate-pulse text-teal-300">{lang === 'th' ? 'กำลังอ่านดวงดาว...' : 'Reading the stars...'}</div>;
  }

  return (
    <div className="flex min-h-[100dvh] w-full flex-col md:flex-row bg-[#0F172A] text-slate-200 font-serif p-4 md:p-6 gap-6 md:gap-8 overflow-y-auto overflow-x-hidden md:overflow-hidden relative">
      
      {/* Language Toggle */}
      <button 
        onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
        className="absolute top-4 right-4 z-50 bg-slate-800/80 hover:bg-slate-700 font-sans text-xs px-3 py-1.5 rounded border border-slate-600 text-slate-300 transition-colors"
      >
        {lang === 'th' ? 'EN' : 'TH'}
      </button>

      {/* Left Column: Branding & Meta */}
      <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col justify-between md:border-r border-slate-700/50 md:pr-8 mb-4 md:mb-0 shrink-0">
        <div className="text-center md:text-left">
          <div className="text-[10px] md:text-xs tracking-[0.2em] uppercase text-emerald-400 mb-1 md:mb-2 font-sans font-semibold">LINE Official Account</div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-none mb-3 md:mb-6 italic text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500 uppercase drop-shadow-sm">
            Dental<h1 className="hidden md:inline"><br/></h1><span className="md:hidden"> </span>Oracle
          </h1>
          <p className="text-xs md:text-sm font-sans text-slate-400 leading-relaxed mb-4 md:mb-8 max-w-[280px] md:max-w-none mx-auto md:mx-0">
            {lang === 'th' ? 'การผสานลี้ลับแห่งสุขอนามัยช่องปากและชะตาแห่งสวรรค์ เลือกไพ่ของคุณเพื่อเปิดเผยภารกิจประจำวัน' : 'A mystical alignment of dental hygiene and celestial fate. Choose your card to reveal your daily mission.'}
          </p>
        </div>

        <div className="flex flex-row md:flex-col justify-center md:justify-start space-x-8 md:space-x-0 md:space-y-6 pb-2 md:pb-4 border-t border-slate-800 pt-4 text-center md:text-left">
          <div className="md:border-none md:pt-0">
             <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 font-sans font-semibold">{lang === 'th' ? 'สถานะสำรับ' : 'Deck Status'}</div>
             <div className="flex flex-col md:flex-row items-center md:items-end md:gap-2">
                <span className="text-3xl md:text-4xl font-light leading-none">{availableCount}</span>
                <span className="text-slate-500 text-[10px] md:text-sm font-sans mt-1 md:mt-0 md:mb-1">/ 23 {lang === 'th' ? 'ใบ' : 'left'}</span>
             </div>
          </div>
          <div className="md:border-t md:border-slate-800 md:pt-4">
             <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 font-sans font-semibold">{lang === 'th' ? 'สิทธิ์การจั่ว' : 'Player Draw'}</div>
             <div className="text-xs md:text-sm font-sans text-slate-300">{lang === 'th' ? '1 ครั้งต่อวัน' : '1 per day'}</div>
             <div className="text-[10px] md:text-xs text-emerald-500 mt-1 italic">
                {hasDrawnToday ? (lang === 'th' ? 'ครบสิทธิ์แล้ว' : 'Limit reached') : (lang === 'th' ? 'จั่วไพ่ได้เลย' : 'Draw available')}
             </div>
          </div>
        </div>
      </div>

      {/* Main Column: Content */}
      <main className="flex-1 flex flex-col items-center justify-center relative py-4 md:py-0 w-full max-w-sm md:max-w-none mx-auto">
        {error && (
          <div className="w-full mb-6 max-w-lg rounded-lg bg-red-900/40 border border-red-500/50 p-4 text-center text-red-200 text-sm font-sans">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {!hasDrawnToday || !mission ? (
            <motion.div 
              key="deck"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center w-full max-w-lg"
            >
               {/* Deck representation styled with new aesthetic */}
               <div className="relative h-64 w-48 mb-12">
                 {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute inset-0 rounded-lg flex items-center justify-center ${i === 4 ? 'bg-white/5 border-2 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)] text-emerald-400' : 'bg-slate-800/50 border border-slate-700 text-slate-600 shadow-xl'}`}
                      style={{ 
                        transformOrigin: 'bottom center',
                        rotate: (i - 2) * 5,
                        zIndex: i
                      }}
                    >
                      {i === 4 ? (
                         <div className="w-full h-full flex flex-col items-center justify-center relative">
                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span className="text-xs font-sans tracking-widest uppercase">{lang === 'th' ? 'เลือก' : 'Select'}</span>
                         </div>
                      ) : (
                         <div className="text-3xl opacity-20">🦷</div>
                      )}
                    </motion.div>
                 ))}
               </div>

               <motion.button
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={drawCard}
                 disabled={drawing}
                 className="px-12 py-4 bg-emerald-600 text-white font-sans font-bold rounded-full text-sm uppercase tracking-widest hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/20 disabled:opacity-50"
               >
                  {drawing ? (
                    <span className="flex items-center gap-2"><RefreshCcw className="w-4 h-4 animate-spin" /> {lang === 'th' ? 'กำลังสุ่ม...' : 'DRAWING...'}</span>
                  ) : (lang === 'th' ? 'สุ่มชะตาของคุณ' : 'DRAW YOUR FATE')}
               </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, rotateY: 90, scale: 0.8 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              className="relative w-full max-w-sm bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col items-center text-center shadow-2xl overflow-hidden group"
            >
               {/* Shimmer effect overlay */}
               <motion.div
                 className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent skew-x-12 pointer-events-none w-[150%] -ml-[25%]"
                 initial={{ x: '-150%' }}
                 animate={{ x: '150%' }}
                 transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', repeatDelay: 1.5 }}
               />
               
               {/* Subtle background pulse */}
               <motion.div
                 className="absolute inset-0 z-0 bg-emerald-900/10 mix-blend-overlay pointer-events-none"
                 animate={{ opacity: [0.2, 0.6, 0.2] }}
                 transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
               />

               <div className="relative z-10 w-full mb-6 flex justify-between items-center px-2">
                 <div className="h-px bg-slate-700 flex-1"></div>
                 <div className="mx-4 text-[10px] font-sans tracking-widest text-slate-500 uppercase">{lang === 'th' ? 'ผลลัพธ์' : 'The Result'}</div>
                 <div className="h-px bg-slate-700 flex-1"></div>
               </div>

               <motion.div 
                 animate={{ y: [0, -8, 0] }}
                 transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                 className="relative z-10 w-32 aspect-[3/4] bg-gradient-to-b from-emerald-900 to-slate-900 border border-emerald-500/30 rounded-xl mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.15)]"
               >
                  <div className="text-4xl leading-none drop-shadow-xl">✨</div>
               </motion.div>

               <h3 className="relative z-10 text-2xl font-bold mb-2 text-white">{lang === 'th' ? mission.titleTh : mission.title}</h3>
               <p className="relative z-10 text-emerald-400 italic mb-6">"{lang === 'th' ? mission.horoscopeTh : mission.horoscope}"</p>

               <div className="relative z-10 bg-slate-950/80 p-4 rounded-xl w-full text-left border border-slate-800 mb-8 backdrop-blur-sm shadow-inner">
                 <div className="text-[10px] font-sans text-emerald-500 uppercase mb-2 tracking-tighter">{lang === 'th' ? 'ภารกิจของคุณ' : 'Your Mission'}</div>
                 <p className="text-sm font-sans leading-relaxed text-slate-300">
                   {lang === 'th' ? mission.descriptionTh : mission.description}
                 </p>
               </div>

               <div className="relative z-10 mt-auto w-full">
                  <div className="text-[10px] font-sans text-slate-600 uppercase mb-3 text-center tracking-widest">{lang === 'th' ? 'แชร์ผลลัพธ์' : 'Share Result'}</div>
                  <div className="flex flex-col gap-3 justify-center mb-4">
                    <button 
                       onClick={() => shareToChat('picker')}
                       className="w-full h-11 rounded-full bg-[#06C755] flex items-center justify-center gap-2 cursor-pointer hover:bg-[#05b04a] transition-colors shadow-lg text-white font-sans font-medium text-sm"
                    >
                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 10.3c0-4.7-5.4-8.5-12-8.5S0 5.6 0 10.3c0 4.2 4.3 7.7 10.1 8.4.4.1.9.3 1.1.8l.4 1.3c.1.4.1.5.3.5.2 0 .4-.2.3-.5l-.8-2.5s0-.1 0-.1c-.1-.2-.2-.4-.4-.5-4.8-.8-8.3-3.7-8.3-7 0-3.9 4.6-7.1 10.2-7.1s10.2 3.2 10.2 7.1c0 3.3-3.5 6.2-8.3 7-.1 0-.2.1-.2.2v.1l.8 2.5c.1.3-.1.5-.3.5-.2 0-.2-.1-.3-.5l-.4-1.3c-.2-.5-.7-.7-1.1-.8-5.8-.7-10.1-4.2-10.1-8.4zm-14.7 3c0 .2.2.4.4.4s.4-.2.4-.4v-2.2h1.4c.2 0 .4-.2.4-.4s-.2-.4-.4-.4H9.7c-.2 0-.4.2-.4.4v3zm3.5 0c0 .2.2.4.4.4h.8c.2 0 .4-.2.4-.4v-3c0-.2-.2-.4-.4-.4s-.4.2-.4.4v3h-.4c-.2 0-.4.2-.4.4zm3 0c0 .2.2.4.4.4h1c.2 0 .4-.2.4-.4v-2.2h.5c.2 0 .4-.2.4-.4s-.2-.4-.4-.4h-1.9c-.2 0-.4.2-.4.4v3zm2.5 0c0 .2.2.4.4.4h1.1c.2 0 .4-.2.4-.4s-.2-.4-.4-.4h-.7v-.8h.7c.2 0 .4-.2.4-.4s-.2-.4-.4-.4h-.7v-.7h.7c.2 0 .4-.2.4-.4s-.2-.4-.4-.4h-1.1c-.2 0-.4.2-.4.4v3z"/></svg>
                       {lang === 'th' ? 'แชร์ให้เพื่อน' : 'Share to Friends'}
                    </button>
                    <button 
                       onClick={() => shareToChat('current')}
                       className="w-full h-11 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-700 transition-colors shadow-lg text-white font-sans font-medium text-sm"
                    >
                       {lang === 'th' ? 'ส่งเข้าแชทนี้ (OA)' : 'Send to Current Chat (OA)'}
                    </button>
                    {import.meta.env.VITE_LINE_OA_ID && (
                      <a 
                         href={`https://line.me/R/ti/p/${import.meta.env.VITE_LINE_OA_ID.replace('@', '%40')}`}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="w-full h-11 rounded-full bg-slate-100 flex items-center justify-center gap-2 cursor-pointer hover:bg-white transition-colors shadow-lg text-slate-900 font-sans font-medium text-sm"
                      >
                         {lang === 'th' ? 'เพิ่มเพื่อน Official Account' : 'Add Official Account'}
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2 justify-center">
                    <div className="flex-1 bg-emerald-950/30 border border-emerald-900/50 rounded-lg text-[10px] flex items-center px-3 h-8 text-emerald-400 font-sans tracking-widest overflow-hidden text-ellipsis whitespace-nowrap justify-center">
                       ID: {userProfile.userId.substring(0, 10).toUpperCase()}
                    </div>
                  </div>
               </div>
               
               <button 
                 onClick={() => {
                   if (import.meta.env.VITE_LIFF_ID === "") {
                     setHasDrawnToday(false);
                   }
                 }}
                 className="mt-6 text-[10px] font-sans text-slate-500 hover:text-slate-400 underline underline-offset-4"
               >
                  {lang === 'th' ? 'กลับมาใหม่พรุ่งนี้พื่อดูคำทำนายใหม่' : 'Come back tomorrow for a new reading.'}
                  {import.meta.env.VITE_LIFF_ID === "" && (lang === 'th' ? " (คลิกเพื่อรีเซ็ตสถานะ - สำหรับทดสอบ)" : " (Click to override for testing)")}
               </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
