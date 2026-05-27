const mongoose = require('mongoose');
const User = require('../models/User');
const Collection = require('../models/Collection');
const Dispatch = require('../models/Dispatch');
const Return = require('../models/Return');
const SosRequest = require('../models/SosRequest');
const Distribution = require('../models/Distribution');

const LINEN_TYPES = ["Bedsheet", "Pillow Cover", "Blankets", "Patient Gown", "Mother Gown", "NICU Gown", "Surgical Linen", "Staff Uniform", "Towel", "Drapes", "Aprons", "Curtains"];
const WARDS = ['ICU', 'General Ward', 'Maternity', 'Emergency', 'Surgery', 'Pediatrics', 'Oncology'];
const VENDORS = ['Vendor A', 'Vendor B'];

// Helper to get random item from array
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
// Helper to get random number in range
const randRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hlms';

async function seedDatabase() {
  console.log("Connecting to MongoDB for seeding...");
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI);
  }

  // 1. Clear Existing Data
  console.log("Clearing old collections...");
  await User.deleteMany({});
  await Collection.deleteMany({});
  await Dispatch.deleteMany({});
  await Return.deleteMany({});
  await SosRequest.deleteMany({});
  await Distribution.deleteMany({});

  // 2. Insert Core Users
  console.log("Seeding core users...");
  const workers = [
    { empId: 'EMP-001', fullName: 'Mahesh', role: 'worker', title: 'Ground Worker', pin: '1234', gender: 'Male' },
    { empId: 'EMP-002', fullName: 'Anitha', role: 'worker', title: 'Ground Worker', pin: '5678', gender: 'Female' }
  ];
  await User.insertMany(workers);

  // 3. Generate 30 Days of Operational Linen Flow
  console.log("Generating 30 days of simulation data...");
  const today = new Date();
  
  // Keep arrays of elements to link them together
  for (let i = 30; i >= 0; i--) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() - i);
    currentDate.setHours(8, 0, 0, 0); // Start operations at 8 AM each day

    // Daily Transaction Flow
    const dayCollections = [];
    const dayBags = [];
    
    // a. 2 to 4 collections per day
    const numCols = randRange(2, 4);
    for (let c = 0; c < numCols; c++) {
      const ward = rand(WARDS);
      const floor = randRange(1, 9).toString();
      const room = randRange(100, 999).toString();
      const bagId = `BAG-${randRange(10, 999)}`;
      const bagColor = rand(['Yellow', 'Blue']);
      const worker = (i === 0) ? (c % 2 === 0 ? workers[0] : workers[1]) : rand(workers);
      const itemsCount = randRange(5, 20);
      
      const items = [];
      const categoryOptions = ["Bedsheet", "Patient Gown", "Towel", "Pillow Cover"];
      for (let itemIdx = 0; itemIdx < itemsCount; itemIdx++) {
        items.push({
          sNo: itemIdx + 1,
          serial: `RFID_CLN_${randRange(10000, 99999)}`,
          color: 'Standard',
          status: 'Matched'
        });
      }

      // Stagger times slightly
      const colTime = new Date(currentDate);
      colTime.setMinutes(c * 45);

      const colObj = new Collection({
        ward,
        floor,
        room,
        bagId,
        bagColor,
        empId: worker.empId,
        empName: worker.fullName,
        timestamp: colTime,
        items,
        status: 'Collected'
      });

      await colObj.save();
      dayCollections.push(colObj);
      dayBags.push({
        id: bagId,
        weight: (randRange(150, 450) / 10).toFixed(1), // 15kg to 45kg
        type: bagColor
      });
    }

    // b. Daily dispatches (send the day's bags to a vendor at 4 PM)
    if (dayBags.length > 0) {
      const vendor = rand(VENDORS);
      const totalWeight = dayBags.reduce((acc, b) => acc + parseFloat(b.weight), 0);
      const totalCost = totalWeight * 45;
      const worker = (i === 0) ? workers[0] : rand(workers);

      const dispTime = new Date(currentDate);
      dispTime.setHours(16, 0, 0, 0); // 4 PM

      const dispatchObj = new Dispatch({
        vendor,
        totalWeight: parseFloat(totalWeight.toFixed(1)),
        ratePerKg: 45,
        totalCost: parseFloat(totalCost.toFixed(2)),
        empId: worker.empId,
        empName: worker.fullName,
        timestamp: dispTime,
        bags: dayBags,
        status: 'Dispatched to Vendor'
      });
      await dispatchObj.save();

      // c. Simulate returns (washed laundry returns 1 to 2 days later)
      // Only return if it's not in the future relative to our simulation date
      const daysDelay = randRange(1, 2);
      const returnDate = new Date(currentDate);
      returnDate.setDate(currentDate.getDate() + daysDelay);
      returnDate.setHours(11, 0, 0, 0); // Returns at 11 AM

      if (returnDate < today) {
        // Collect all items expected back from this dispatch
        let expectedCount = 0;
        const expectedItems = [];
        const returnedBags = dayBags.map(b => b.id);
        
        for (const col of dayCollections) {
          expectedCount += col.items.length;
          col.items.forEach(it => {
            expectedItems.push({
              serial: it.serial,
              category: rand(["Bedsheet", "Patient Gown", "Towel", "Pillow Cover"]) // assign category
            });
          });
        }

        // Build return stats & introduce random discrepancies
        let missingItems = [];
        let damagedItems = [];
        let receivedCount = expectedCount;
        
        // 15% chance of discrepancy (missing or damaged items)
        if (Math.random() < 0.15 && expectedItems.length > 3) {
          const discType = rand(['missing', 'damaged', 'both']);
          if (discType === 'missing' || discType === 'both') {
            const count = randRange(1, 2);
            for (let dIdx = 0; dIdx < count; dIdx++) {
              const pulled = expectedItems.pop();
              if (pulled) missingItems.push(pulled.serial);
            }
            receivedCount -= count;
          }
          if (discType === 'damaged' || discType === 'both') {
            const count = randRange(1, 2);
            for (let dIdx = 0; dIdx < count; dIdx++) {
              const item = expectedItems[randRange(0, expectedItems.length - 1)];
              if (item && !damagedItems.includes(item.serial)) {
                damagedItems.push(item.serial);
              }
            }
          }
        }

        const retWorker = rand(workers);
        const returnObj = new Return({
          vendor,
          empId: retWorker.empId,
          empName: retWorker.fullName,
          timestamp: returnDate,
          receivedWeight: parseFloat((totalWeight * 0.95).toFixed(1)), // minor weight loss due to drying/cleaning
          returnedBags,
          stats: {
            expectedCount,
            receivedCount,
            missingCount: missingItems.length,
            damagedCount: damagedItems.length
          },
          missingItems,
          damagedItems
        });
        await returnObj.save();

        // Seed distribution drop-off back to the room
        if (dayCollections.length > 0) {
          const mainCol = dayCollections[0];
          const distItems = expectedItems.map(it => ({
            serial: it.serial,
            category: it.category
          }));

          const distObj = new Distribution({
            ward: mainCol.ward,
            floor: mainCol.floor,
            room: mainCol.room,
            empId: retWorker.empId,
            empName: retWorker.fullName,
            timestamp: returnDate,
            items: distItems
          });
          await distObj.save();
        }
      }
    }

    // d. Generate occasional emergency SOS requests from wards (every 3 days)
    if (i % 3 === 0) {
      const reqWorkerName = rand(['Sarah Jenkins', 'Nancy Drew', 'John Carter', 'Sarah Kanna', 'Clara Oswald']);
      const reqWorkerId = `NUR-${randRange(1000, 9999)}`;
      const ward = rand(WARDS);
      const floor = randRange(1, 8).toString();
      const room = randRange(100, 800).toString();
      
      const requestedItems = [];
      const numItems = randRange(1, 3);
      for (let rIdx = 0; rIdx < numItems; rIdx++) {
        requestedItems.push({
          item: rand(["Bedsheet", "Patient Gown", "Aprons", "Towel", "Pillow Cover"]),
          qty: randRange(1, 10)
        });
      }

      const requestTime = new Date(currentDate);
      requestTime.setHours(10, 30, 0, 0); // 10:30 AM

      // Most historic requests are resolved, but keep the latest 1-2 active
      const status = (i <= 2) ? 'Active' : 'Resolved';

      const sosObj = new SosRequest({
        empId: reqWorkerId,
        empName: reqWorkerName,
        ward,
        floor,
        room,
        requestedItems,
        timestamp: requestTime,
        status
      });
      await sosObj.save();
    }
  }

  console.log("MongoDB Database Seeding completed successfully!");
  if (process.env.RUNNING_STANDALONE) {
    await mongoose.connection.close();
    console.log("Connection closed.");
  }
}

// Execute directly if run via CLI
if (require.main === module) {
  process.env.RUNNING_STANDALONE = 'true';
  seedDatabase().catch(err => {
    console.error("Seeding Failed:", err);
    process.exit(1);
  });
}

module.exports = seedDatabase;
