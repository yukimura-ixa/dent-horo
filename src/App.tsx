import { useEffect, useState } from 'react';
import liff from '@line/liff';
import { signInAnonymously } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import GameBoard from './components/GameBoard';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<{ displayName: string, userId: string } | null>(null);

  useEffect(() => {
    async function init() {
      try {
        // Initialize Firebase Auth
        let fbUser;
        try {
          const userCredential = await signInAnonymously(auth);
          fbUser = userCredential.user;
        } catch (err: any) {
          if (err.code === 'auth/admin-restricted-operation') {
            throw new Error('Please enable "Anonymous" sign-in in your Firebase Console (Authentication > Sign-in method) to allow LINE users to connect securely.');
          }
          throw err;
        }

        // Initialize LIFF
        const liffId = import.meta.env.VITE_LIFF_ID;
        let displayName = 'Guest User';
        let finalUserId = fbUser.uid;

        if (!liffId) {
          console.warn('VITE_LIFF_ID is missing. Running in mock mode for preview.');
        } else {
          try {
            await liff.init({ liffId });
            if (!liff.isLoggedIn()) {
              liff.login();
              return;
            }
            const profile = await liff.getProfile();
            displayName = profile.displayName || 'Guest User';
            if (profile.userId) {
               finalUserId = profile.userId;
            }
          } catch (liffError: any) {
            console.error('LIFF Init Error:', liffError);
            console.warn('Falling back to mock mode due to LIFF error.');
          }
        }

        setUserProfile({ displayName, userId: finalUserId });

        // Check if user exists in Firestore
        const userRef = doc(db, 'users', finalUserId);
        let userSnap;
        try {
          userSnap = await getDoc(userRef);
        } catch (e: any) {
          console.error("getDoc error:", e);
          throw new Error('getDoc userRef failed: ' + e.message);
        }
        
        if (!userSnap.exists()) {
          try {
            await setDoc(userRef, {
              displayName: displayName,
              pickedCardsHistory: [],
              lastPickedDate: '',
              lastMissionId: ''
            });
          } catch (e: any) {
             console.error("setDoc error:", e);
             throw new Error('setDoc userRef failed: ' + e.message);
          }
        }
        
        setLoading(false);
      } catch (err: any) {
        console.error('Initialization error:', err);
        setError(err.message || 'Failed to initialize app');
        setLoading(false);
      }
    }

    init();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center animate-pulse">
          <div className="h-12 w-12 rounded-full border-4 border-t-transparent border-teal-400 animate-spin mb-4" />
          <p className="text-teal-400 font-medium tracking-widest text-sm uppercase">Aligning Stars...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-950 p-6 text-center text-white">
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6">
          <h2 className="mb-2 text-xl font-bold text-red-400">Cosmic Interference</h2>
          <p className="text-sm text-red-200">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-teal-500/30">
      {userProfile && <GameBoard userProfile={userProfile} />}
    </div>
  );
}
