const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Please provide content'],
    trim: true
  },
  thumbnail: {
    type: String,
    default: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800'
  },
  category: {
    type: String,
    enum: ['general', 'nutrition', 'mental-health', 'fitness', 'diseases', 'prevention'],
    default: 'general'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  published: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
articleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for searching and filtering
articleSchema.index({ title: 'text', content: 'text' });
articleSchema.index({ category: 1, published: 1, createdAt: -1 });

module.exports = mongoose.model('Article', articleSchema);