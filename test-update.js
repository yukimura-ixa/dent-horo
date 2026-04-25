import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, doc, setDoc, runTransaction } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function run() {
  try {
    const cred = await signInAnonymously(auth);
    console.log('Logged in as:', cred.user.uid);
    
    // Simulate what App.tsx does
    const randomId = 'U' + Math.random().toString(36).substring(2);
    const userRef = doc(db, 'users', randomId);
    await setDoc(userRef, {
      displayName: 'Guest User',
      pickedCardsHistory: [],
      lastPickedDate: '',
      lastMissionId: ''
    });
    console.log('Successfully setDoc!');

    // Simulate what GameBoard does
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });
    const deckRef = doc(db, 'daily_decks', today);

    await runTransaction(db, async (transaction) => {
        const userSnap = await transaction.get(userRef);
        const deckSnap = await transaction.get(deckRef);

        const userData = userSnap.exists() ? userSnap.data() : {
          displayName: 'Guest User',
          pickedCardsHistory: [],
          lastPickedDate: '',
          lastMissionId: ''
        };

        const deckData = deckSnap.exists() ? deckSnap.data() : {
          date: today,
          pickedCardIds: []
        };

        const drawnMissionId = 'm1';

        deckData.pickedCardIds.push(drawnMissionId);
        deckData.date = today;

        userData.lastPickedDate = today;
        userData.lastMissionId = drawnMissionId;
        const newHistory = [...userData.pickedCardsHistory];
        newHistory.push(drawnMissionId);
        userData.pickedCardsHistory = newHistory;

        transaction.set(userRef, userData, { merge: true });
        transaction.set(deckRef, deckData, { merge: true });
    });
    console.log('Successfully updated via transaction!');

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit(0);
  }
}

run();
