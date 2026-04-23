import { collection, addDoc, getDocs, updateDoc, doc, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

const isConfigured = false;

export const fetchActiveAlerts = async () => {
    if (!isConfigured) return [
        { id: 1, session: '#88A9', text: 'Vendor B returned 48/50 ICU Blankets. 2 items marked as Dues.' }
    ];
    
    const q = query(collection(db, 'returns'), where('discrepancies', '==', true));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const fetchLiveOperations = async () => {
    if (!isConfigured) return [
        { id: '#DIS-9021', type: 'Dispatch', vendor: 'Vendor A', status: 'In Transit' },
        { id: '#RET-88A9', type: 'Return', vendor: 'Vendor B', status: 'Reconciled' },
        { id: '#DIS-9022', type: 'Dispatch', vendor: 'Vendor B', status: 'Pending Weighing' }
    ];

    const snap = await getDocs(collection(db, 'dispatches'));
    return snap.docs.map(d => ({ id: d.id, ...d.data(), type: 'Dispatch' }));
};

export const fetchInventoryStats = async () => {
    if (!isConfigured) return {
        total: 12450,
        inCirculation: 8200,
        atVendor: 4250,
        damaged: 15
    };

    // Calculate real stats from Firestore collections here
    return { total: 0, inCirculation: 0, atVendor: 0, damaged: 0 };
};
