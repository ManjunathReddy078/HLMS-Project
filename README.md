# Hospital Laundry Management System (HLMS)
**Developed By:** Seelam Manjunath Reddy and Karthikeyan H N
**Status:** Phase 1 & 2 Completed (Software-First Handoff)

A robust, full-stack Hospital Laundry Management ecosystem designed to eliminate human error, digitalize audit logs, and perfectly track the hospital linen lifecycle. This project has been engineered to perfectly simulate enterprise IoT RFID functionality without the upfront hardware cost, serving as a turnkey digital foundation for Phase 3 physical deployment.

## System Ecosystem Overview

The architecture features a local Node.js, Express, and MongoDB Compass backend connecting three distinct front-end environments tailored for different operational roles:

1. **`/Code/backend/` (Central Data Hub & Production Backend)**
   - A robust Express server backed by a local MongoDB Compass instance (`mongodb://127.0.0.1:27017/hlms`). Automatically seeds historical mock operational logs on startup and serves endpoints for live collections, dispatches, returns, distributions, and SOS requests.
   - *Note:* `/Code/server/` contains a legacy `json-server` mock database that can be used for zero-dependency offline prototyping.

2. **`/Code/android/` (Ground Worker Handheld Hub)**
   - Built with React Native & Expo. Features a software simulation array mimicking a Zebra UHF RFID scanner for bulk scanning.
   - **Looping Alarm + Vibration Alerts:** Integrated a looping emergency buzzer tone (`SOS_alert_alarm.wav`) and infinite vibration pattern to alert ground staff instantly when a new SOS request is received.
   - **Dynamic Audit Logs:** Displays the latest 10 actions (collections, dispatches, returns, and distributions) filtered specifically for the logged-in employee ID in real time.

3. **`/Code/website/` (Decentralized Ward Request Portal)**
   - Built with React & Vite. A lightweight portal for floor nurses to bypass the hospital intercom system, pushing live JSON emergency SOS requests directly to the backend.

4. **`/Code/web/` (Nursing Superintendent & Operations Supervisor Dashboards)**
   - Built with React & Vite. The master control panel designed with a premium, clinical SaaS UI. Facilitates deep analytics (`recharts`), live inventory tracking, active SOS monitoring, and vendor discrepancy alerts.

---

## 🚀 Absolute Quick Start Guide (Handoff Instructions)

To run the full ecosystem, you must open **4 separate terminal windows** at the root of this project. Run the following commands in exact order:

**Terminal 1: Boot the Master Database (MongoDB Express Service)**
```bash
cd Code/backend
npm install
npm start
```

**Terminal 2: Boot the Ward SOS Portal**
```bash
cd Code/website
npm install
npm run dev
# Opens on http://localhost:5173
```

**Terminal 3: Boot the Management Dashboards**
```bash
cd Code/web
npm install
npm run dev
# Opens on http://localhost:5174
```

**Terminal 4: Boot the Ground Worker Android Hub**
```bash
cd Code/android
npm install
npm start
# Press 'w' to run in web mode, or scan the QR code with the Expo Go app.
```

---

## 🛠️ Important Notes for the Successor Team
* **MongoDB Database & Seeding:** The backend runs on Node.js/Express and connects to MongoDB Compass locally (`mongodb://127.0.0.1:27017/hlms`). On first startup, the server automatically seeds the database with 30 days of backdated operational data. To seed manually at any point, run `npm run seed` inside `/Code/backend`.
* **IoT Hardware Migration:** Please refer to the Transition Plan for a complete breakdown of the Zebra RFD40 physical hardware implementation plan.
* **Network Binding:** The Android Hub API calls in `Code/android/app/services/db.js` are hardcoded to your local Wi-Fi IPv4 address (`10.217.126.75`). If you test on a physical phone, ensure both phone and laptop are on the same Wi-Fi, and update this IP address if your router assigns a new one.
