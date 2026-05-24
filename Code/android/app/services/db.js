/**
 * Universal Database Controller for HLIMS.
 * Wired directly to the Local JSON Server for frictionless handoff.
 */
import { Platform } from 'react-native';

// Use the physical machine's Wi-Fi IP address so Expo Go on a mobile phone can connect
const BASE_URL = 'http://10.217.126.75:5000';

export const logCollection = async (ward, items) => {
  try {
    await fetch(`${BASE_URL}/collections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ward,
        items,
        timestamp: new Date().toISOString(),
        status: 'In Central Laundry'
      })
    });
  } catch (err) {
    console.error("Local DB Error:", err);
  }
};

export const createDispatch = async (vendor, weight, batchDetails) => {
  try {
    await fetch(`${BASE_URL}/dispatches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vendor,
        weight,
        batchDetails,
        timestamp: new Date().toISOString(),
        status: 'In Transit'
      })
    });
  } catch (err) {
    console.error("Local DB Error:", err);
  }
};

export const processReturn = async (dispatchId, receivedDetails) => {
  try {
    await fetch(`${BASE_URL}/returns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dispatchId,
        receivedDetails,
        timestamp: new Date().toISOString(),
        discrepancies: receivedDetails.due > 0 || receivedDetails.damaged > 0
      })
    });
  } catch (err) {
    console.error("Local DB Error:", err);
  }
};
