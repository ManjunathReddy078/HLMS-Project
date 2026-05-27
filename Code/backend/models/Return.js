const mongoose = require('mongoose');

const ReturnSchema = new mongoose.Schema({
  vendor: { type: String, required: true },
  empId: { type: String, required: true },
  empName: { type: String, required: true },
  timestamp: { type: Date, required: true },
  receivedWeight: { type: Number, required: true },
  returnedBags: [{ type: String }],
  stats: {
    expectedCount: { type: Number },
    receivedCount: { type: Number },
    missingCount: { type: Number },
    damagedCount: { type: Number }
  },
  missingItems: [{ type: String }],
  damagedItems: [{ type: String }],
  discrepancies: { type: Boolean }
});

module.exports = mongoose.model('Return', ReturnSchema);
