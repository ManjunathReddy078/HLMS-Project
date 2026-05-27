const mongoose = require('mongoose');

const DistributionSchema = new mongoose.Schema({
  ward: { type: String, required: true },
  floor: { type: String, required: true },
  room: { type: String, required: true },
  empId: { type: String, required: true },
  empName: { type: String, required: true },
  timestamp: { type: Date, required: true },
  items: [{
    serial: { type: String, required: true },
    category: { type: String, required: true }
  }],
  sosId: { type: String }
});

module.exports = mongoose.model('Distribution', DistributionSchema);
