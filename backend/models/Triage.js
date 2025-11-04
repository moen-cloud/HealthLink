const mongoose = require('mongoose');

const triageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symptoms: {
    fever: { type: Boolean, default: false },
    cough: { type: Boolean, default: false },
    difficultyBreathing: { type: Boolean, default: false },
    weakness: { type: Boolean, default: false },
    headache: { type: Boolean, default: false },
    bodyAches: { type: Boolean, default: false },
    soreThroat: { type: Boolean, default: false },
    nausea: { type: Boolean, default: false },
    diarrhea: { type: Boolean, default: false },
    chestPain: { type: Boolean, default: false },
    other: { type: String, trim: true }
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  recommendation: {
    type: String,
    required: true
  },
  doctorResponse: {
    type: String,
    trim: true
  },
  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  respondedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for user queries
triageSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Triage', triageSchema);