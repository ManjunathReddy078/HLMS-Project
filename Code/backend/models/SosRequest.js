const mongoose = require('mongoose');

const SosRequestSchema = new mongoose.Schema({
  empId: { type: String, required: true },
  empName: { type: String, required: true },
  ward: { type: String, required: true },
  floor: { type: String, required: true },
  room: { type: String, required: true },
  requestedItems: [{
    item: { type: String, required: true },
    qty: { type: Number, required: true }
  }],
  timestamp: { type: Date, required: true },
  status: { type: String, enum: ['Active', 'Pending', 'Resolved'], default: 'Active' }
});

module.exports = mongoose.model('SosRequest', SosRequestSchema);
