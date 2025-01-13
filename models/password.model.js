const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema({
  website: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  category: {
    type: String,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

passwordSchema.index({ username: 1, password: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Password', passwordSchema);
