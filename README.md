# Hospital Laundry Management System (HLMS)

A robust, full-stack Hospital Laundry Management solution designed to eliminate human error, digitalize audit logs, and streamline the linen lifecycle across the hospital.

## Project Architecture

The architecture is divided into three distinct front-end environments tailored for different operational roles:

*   **`/Code/android/` (Ground Worker Mobile Hub)**
    Built with React Native and Expo. This is the handheld application used by ground staff. It features failproof RFID scanning logic, cumulative memory tracking, offline-ready state management, and vendor-locked dispatch constraints to eliminate physical inventory discrepancies.
*   **`/Code/website/` (Ward Request Portal)**
    Built with React and Vite. A lightweight, responsive, single-page web portal designed for floor nurses. It bypasses the physical intercom system by pushing emergency JSON payload SOS requests directly to the Ground Worker's Android device.
*   **`/Code/web/` (Nursing Superintendent Dashboard)**
    Built with React. The master control panel designed for high-level administration. Facilitates deep analytics, inventory tracking, discrepancy reporting, and vendor billing reconciliation.

## Quick Start Development Guide

To spin up any of the environments locally, navigate to the respective directory and install the Node dependencies:

```bash
# Example: Spinning up the Ground Worker App
cd Code/android
npm install
npm start
```

```bash
# Example: Spinning up the Ward Request Portal
cd Code/website
npm install
npm run dev
```
