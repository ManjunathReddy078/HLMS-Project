/**
 * Local JSON Server API Services for Web Dashboards
 */

const BASE_URL = 'http://127.0.0.1:5000';

const fetchWithTimeout = async (url, options = {}) => {
  const { timeout = 3000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(url, { ...options, signal: controller.signal });
  clearTimeout(id);
  return response;
};

export const fetchActiveAlerts = async () => {
    try {
        const res = await fetchWithTimeout(`${BASE_URL}/returns`);
        const returns = await res.json();
        return returns.filter(r => r.discrepancies === true);
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const fetchLiveOperations = async () => {
    try {
        const res = await fetchWithTimeout(`${BASE_URL}/dispatches`);
        const dispatches = await res.json();
        return dispatches.map(d => ({ ...d, type: 'Dispatch' }));
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const fetchInventoryStats = async () => {
    try {
        const cRes = await fetchWithTimeout(`${BASE_URL}/collections`);
        const collections = await cRes.json();
        
        let totalScanned = 0;
        collections.forEach(c => {
            if (c.items) totalScanned += c.items.length;
        });

        return {
            total: 5200 + totalScanned,
            inCirculation: 1450 + totalScanned,
            atVendor: 3700,
            damaged: 50
        };
    } catch (e) {
        console.error(e);
        return { total: 0, inCirculation: 0, atVendor: 0, damaged: 0 };
    }
};

export const fetchSOSRequests = async () => {
    try {
        const res = await fetchWithTimeout(`${BASE_URL}/sos_requests`);
        const requests = await res.json();
        return requests.reverse(); // Newest first
    } catch (e) {
        console.error(e);
        return [];
    }
};
