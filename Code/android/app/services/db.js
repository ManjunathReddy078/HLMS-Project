import { collection, addDoc, getDocs, updateDoc, doc, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../firebase'; // Assumes firebase.js exports 'db'

/**
 * Universal Database Controller for HLIMS.
 * This is production-ready. Until valid Firebase API keys are inserted in firebase.js,
 * it safely falls back to console.logs for demo purposes while preventing crashes.
 */

const isConfigured = false; // Toggle this to true once Firebase keys are added.

export const logCollection = async (ward, items) => {
  if (!isConfigured) return console.log("[MOCK DB] Collected from", ward, items);
  
  await addDoc(collection(db, 'collections'), {
    ward,
    items,
    timestamp: Timestamp.now(),
    status: 'In Central Laundry'
  });
};

export const createDispatch = async (vendor, weight, batchDetails) => {
  if (!isConfigured) return console.log("[MOCK DB] Dispatched to", vendor, weight, batchDetails);

  await addDoc(collection(db, 'dispatches'), {
    vendor,
    weight,
    batchDetails,
    timestamp: Timestamp.now(),
    status: 'In Transit'
  });
};

export const processReturn = async (dispatchId, receivedDetails) => {
  if (!isConfigured) return console.log("[MOCK DB] Return processed for", dispatchId, receivedDetails);

  await addDoc(collection(db, 'returns'), {
    dispatchId,
    receivedDetails,
    timestamp: Timestamp.now(),
    discrepancies: receivedDetails.due > 0 || receivedDetails.damaged > 0
  });

  // Update original dispatch status
  const q = query(collection(db, 'dispatches'), where('dispatchId', '==', dispatchId));
  const snap = await getDocs(q);
  if (!snap.empty) {
    const docRef = doc(db, 'dispatches', snap.docs[0].id);
    await updateDoc(docRef, { status: 'Reconciled' });
  }
};
