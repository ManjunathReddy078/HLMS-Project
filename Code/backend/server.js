const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const User = require('./models/User');
const Collection = require('./models/Collection');
const Dispatch = require('./models/Dispatch');
const Return = require('./models/Return');
const SosRequest = require('./models/SosRequest');
const Distribution = require('./models/Distribution');
const seedDatabase = require('./services/seed');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hlms';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log(`Connected to MongoDB at ${MONGO_URI}`);
    
    // Check if database is empty and auto-seed
    const userCount = await User.countDocuments();
    const colCount = await Collection.countDocuments();
    if (userCount === 0 || colCount === 0) {
      console.log("Database is empty. Triggering auto-seeding script...");
      await seedDatabase();
    } else {
      console.log(`Database already populated. Users: ${userCount}, Collections: ${colCount}. Skipping auto-seed.`);
    }
  })
  .catch(err => {
    console.error("MongoDB connection failed:", err);
  });

// --- API ENDPOINTS ---

// 1. Ground Workers login lookup
app.get('/ground_workers', async (req, res) => {
  try {
    const { empId } = req.query;
    const filter = empId ? { empId } : {};
    const workers = await User.find(filter);
    res.json(workers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Collections (Soiled Linen)
app.get('/collections', async (req, res) => {
  try {
    const { bagId } = req.query;
    const filter = bagId ? { bagId } : {};
    const collections = await Collection.find(filter).sort({ timestamp: -1 });
    res.json(collections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/collections', async (req, res) => {
  try {
    const newCollection = new Collection(req.body);
    await newCollection.save();
    res.status(201).json(newCollection);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 3. Distributions (Clean Linen)
app.get('/distributions', async (req, res) => {
  try {
    const { ward, floor, room } = req.query;
    const filter = {};
    if (ward) filter.ward = ward;
    if (floor) filter.floor = floor;
    if (room) filter.room = room;
    
    const distributions = await Distribution.find(filter).sort({ timestamp: 1 });
    res.json(distributions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/distributions', async (req, res) => {
  try {
    const newDistribution = new Distribution(req.body);
    await newDistribution.save();
    res.status(201).json(newDistribution);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 4. Dispatches (Vendor Shipping)
app.get('/dispatches', async (req, res) => {
  try {
    const dispatches = await Dispatch.find({}).sort({ timestamp: -1 });
    res.json(dispatches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/dispatches', async (req, res) => {
  try {
    const newDispatch = new Dispatch(req.body);
    await newDispatch.save();
    res.status(201).json(newDispatch);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 5. Returns (Vendor Cleaning Receipt)
app.get('/returns', async (req, res) => {
  try {
    const returns = await Return.find({}).sort({ timestamp: -1 });
    const mapped = returns.map(r => {
      const obj = r.toObject();
      if (obj.discrepancies === undefined) {
        obj.discrepancies = (obj.stats && (obj.stats.missingCount > 0 || obj.stats.damagedCount > 0)) || false;
      }
      return obj;
    });
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/returns', async (req, res) => {
  try {
    const payload = req.body;
    if (payload.discrepancies === undefined) {
      payload.discrepancies = (payload.stats && (payload.stats.missingCount > 0 || payload.stats.damagedCount > 0)) || false;
    }
    const newReturn = new Return(payload);
    await newReturn.save();
    res.status(201).json(newReturn);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 6. SOS Requests (Ward shortages)
app.get('/sos_requests', async (req, res) => {
  try {
    const requests = await SosRequest.find({}).sort({ timestamp: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/sos_requests', async (req, res) => {
  try {
    const newRequest = new SosRequest(req.body);
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.patch('/sos_requests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRequest = await SosRequest.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedRequest) {
      return res.status(404).json({ error: "SOS Request not found" });
    }
    res.json(updatedRequest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`HLMS Server is running on port ${PORT}`);
});
