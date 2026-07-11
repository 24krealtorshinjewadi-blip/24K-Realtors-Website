// ═══════════════════════════════════════════════════════════════
// 24K REALTORS — Firebase Services Hub
// Connects: Firebase Auth | Firestore | FCM Push Notifications
// ═══════════════════════════════════════════════════════════════
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, addDoc, updateDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// ── Firebase Project Config ──────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyB4---SxdfSHrbbL8719cfGNQI_2fp8c_o",
  authDomain: "k-realtors.firebaseapp.com",
  projectId: "k-realtors",
  storageBucket: "k-realtors.firebasestorage.app",
  messagingSenderId: "534874694585",
  appId: "1:534874694585:web:cb1c851be3d6eae6dccc68",
  measurementId: "G-3DVXJ4ELYV"
};

// ── Initialize Firebase App ──────────────────────────────────
const app = initializeApp(firebaseConfig);

// ── Firebase Services ────────────────────────────────────────
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account',
  hd: '*' // Allow all Google accounts
});

// ── Messaging (FCM) — graceful init ─────────────────────────
let messaging = null;
try {
  messaging = getMessaging(app);
} catch (e) {
  console.warn('[FCM] Messaging not supported in this browser context:', e.message);
}
export { messaging };

// ═══════════════════════════════════════════════════════════
// AUTH FUNCTIONS
// ═══════════════════════════════════════════════════════════

/**
 * Sign in with Google Popup — REAL OAuth flow
 * Returns Firebase User object + ID Token
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const idToken = await user.getIdToken();
    
    console.log('[Firebase Auth] Google Sign-In success:', user.email);
    return {
      user,
      idToken,
      email: user.email,
      name: user.displayName,
      photo: user.photoURL,
      uid: user.uid
    };
  } catch (error) {
    console.error('[Firebase Auth] Google Sign-In failed:', error.code, error.message);
    throw error;
  }
}

/**
 * Sign out from Firebase
 */
export async function firebaseSignOut() {
  try {
    await signOut(auth);
    console.log('[Firebase Auth] User signed out');
  } catch (error) {
    console.error('[Firebase Auth] Sign out failed:', error);
  }
}

// ═══════════════════════════════════════════════════════════
// FIRESTORE REALTIME FUNCTIONS
// ═══════════════════════════════════════════════════════════

/**
 * Listen to CRM leads in realtime
 * @param {Function} callback - Called whenever leads update
 * @returns {Function} unsubscribe function
 */
export function subscribeToLeads(callback) {
  const leadsRef = collection(db, 'crm_leads');
  const q = query(leadsRef, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const leads = snapshot.docs.map(doc => ({
      firestoreId: doc.id,
      ...doc.data()
    }));
    console.log(`[Firestore] Real-time update: ${leads.length} leads`);
    callback(leads);
  }, (error) => {
    console.error('[Firestore] Lead subscription error:', error);
  });
}

/**
 * Push new lead to Firestore (for cross-agent realtime sync)
 */
export async function pushLeadToFirestore(lead) {
  try {
    const leadsRef = collection(db, 'crm_leads');
    const docRef = await addDoc(leadsRef, {
      ...lead,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      source: 'web_crm'
    });
    console.log('[Firestore] Lead pushed with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('[Firestore] Push lead failed:', error);
    throw error;
  }
}

/**
 * Update lead status in Firestore
 */
export async function updateLeadInFirestore(firestoreId, updates) {
  try {
    const leadRef = doc(db, 'crm_leads', firestoreId);
    await updateDoc(leadRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    console.log('[Firestore] Lead updated:', firestoreId);
  } catch (error) {
    console.error('[Firestore] Update lead failed:', error);
  }
}

/**
 * Subscribe to real-time notifications for agents
 */
export function subscribeToNotifications(agentId, callback) {
  const notifRef = collection(db, 'notifications');
  const q = query(notifRef, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(n => !n.agentId || n.agentId === agentId);
    callback(notifications);
  });
}

// ═══════════════════════════════════════════════════════════
// FCM PUSH NOTIFICATIONS
// ═══════════════════════════════════════════════════════════

const FCM_VAPID_KEY = 'BHzm9_placeholder_vapid_key_replace_with_real';

/**
 * Request push notification permission and get FCM token
 */
export async function requestNotificationPermission() {
  if (!messaging) {
    console.warn('[FCM] Messaging not available');
    return null;
  }
  
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, { vapidKey: FCM_VAPID_KEY });
      console.log('[FCM] Token obtained:', token?.substring(0, 20) + '...');
      return token;
    }
    console.log('[FCM] Notification permission denied');
    return null;
  } catch (error) {
    console.error('[FCM] Permission request failed:', error);
    return null;
  }
}

/**
 * Listen for foreground push messages
 */
export function onForegroundMessage(callback) {
  if (!messaging) return () => {};
  return onMessage(messaging, (payload) => {
    console.log('[FCM] Foreground message:', payload);
    callback(payload);
  });
}

export default app;
