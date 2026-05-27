const mongoose = require('mongoose');

const DispatchSchema = new mongoose.Schema({
  vendor: { type: String, required: true },
  totalWeight: { type: Number, required: true },
  ratePerKg: { type: Number, default: 45 },
  totalCost: { type: Number, required: true },
  empId: { type: String, required: true },
  empName: { type: String, required: true },
  timestamp: { type: Date, required: true },
  bags: [{
    id: { type: String, required: true },
    weight: { type: Number, required: true },
    type: { type: String, enum: ['Yellow', 'Blue'], required: true }
  }],
  status: { type: String, default: 'Dispatched to Vendor' }
});

module.exports = mongoose.model('Dispatch', DispatchSchema);
