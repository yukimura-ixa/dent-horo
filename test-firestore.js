import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  try {
    const cred = await signInAnonymously(auth);
    console.log('Logged in as:', cred.user.uid);
    
    const randomId = 'U' + Math.random().toString(36).substring(2);
    const userRef = doc(db, 'users', randomId);
    await setDoc(userRef, {
      displayName: 'Guest User',
      pickedCardsHistory: [],
      lastPickedDate: '',
      lastMissionId: ''
    });
    console.log('Successfully setDoc!');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit(0);
  }
}

run();
