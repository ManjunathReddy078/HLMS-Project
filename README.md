# Hospital Laundry Management System (HLMS)
**Lead Developer:** Seelam Manjunath Reddy
**Status:** Phase 1 & 2 Completed (Software-First Handoff)

A robust, full-stack Hospital Laundry Management ecosystem designed to eliminate human error, digitalize audit logs, and perfectly track the hospital linen lifecycle. This project has been engineered to perfectly simulate enterprise IoT RFID functionality without the upfront hardware cost, serving as a turnkey digital foundation for Phase 3 physical deployment.

## System Ecosystem Overview

The architecture features a completely agnostic local NoSQL backend connecting three distinct front-end environments tailored for different operational roles:

1. **`/Code/server/` (Central Data Hub)**
   - The master `json-server` acting as a local, frictionless NoSQL database. No API keys, no Firebase billing. Fully offline-capable for seamless developer handoff.

2. **`/Code/android/` (Ground Worker Handheld Hub)**
   - Built with React Native & Expo. Features a built-in software simulation array mimicking a Zebra UHF RFID scanner. Ground staff use this to seamlessly bulk-scan carts to Vendors and Ward collections.

3. **`/Code/website/` (Decentralized Ward Request Portal)**
   - Built with React & Vite. A lightweight portal for floor nurses to bypass the hospital intercom system, pushing live JSON emergency SOS requests directly to the DB.

4. **`/Code/web/` (Nursing Superintendent & Supervisor Dashboards)**
   - Built with React & Vite. The master control panel designed with a premium, hospital-ready 'White Clinical SaaS' UI. Facilitates deep analytics (`recharts`), live inventory tracking, active SOS monitoring, and vendor discrepancy alerts.

---

## 🚀 Absolute Quick Start Guide (Handoff Instructions)

To run the full ecosystem, you must open **4 separate terminal windows** at the root of this project. Run the following commands in exact order:

**Terminal 1: Boot the Master Database**
```bash
cd Code/server
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
* **Database Deadlock Prevention:** The local database in `Code/server` does **not** use `--watch` mode. This is intentional. Do NOT add `--watch` to the package.json, otherwise having `db.json` open in your code editor will cause a Windows file-lock freeze.
* **IoT Hardware Migration:** Please refer to `Future_Enhancements_and_Handoff.md` for a complete breakdown of the Zebra RFD40 and Fujitsu A512 physical hardware implementation plan.
* **Network Binding:** The Android Hub API calls in `Code/android/app/services/db.js` are hardcoded to your local Wi-Fi IPv4 address (`10.217.126.75`). If you test on a physical phone, ensure both phone and laptop are on the same Wi-Fi, and update this IP address if your router assigns a new one.
