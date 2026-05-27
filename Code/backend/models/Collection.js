const mongoose = require('mongoose');

const CollectionSchema = new mongoose.Schema({
  ward: { type: String, required: true },
  floor: { type: String, required: true },
  room: { type: String, required: true },
  bagId: { type: String, required: true },
  bagColor: { type: String, enum: ['Yellow', 'Blue'], required: true },
  empId: { type: String, required: true },
  empName: { type: String, required: true },
  timestamp: { type: Date, required: true },
  items: [{
    sNo: { type: Number },
    serial: { type: String },
    color: { type: String, default: 'Standard' },
    status: { type: String, default: 'Matched' }
  }],
  status: { type: String, default: 'Collected' }
});

module.exports = mongoose.model('Collection', CollectionSchema);
