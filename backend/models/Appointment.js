const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symptoms: {
    type: String,
    required: [true, 'Please describe your symptoms'],
    trim: true
  },
  preferredDate: {
    type: Date,
    required: [true, 'Please provide a preferred date']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  doctorNotes: {
    type: String,
    trim: true
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
appointmentSchema.index({ userId: 1, status: 1 });
appointmentSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Appointment', appointmentSchema);