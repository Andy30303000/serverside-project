const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,        // Unique index defined here only
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,        // Unique index defined here only
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: false      // Allow null for GitHub login users
  },
  githubId: {
    type: String,
    unique: true,        // Unique index defined here only
    sparse: true         // Allows null values (important for non-GitHub users)
  },
  profileImage: {
    type: String,
    default: '/images/default-avatar.jpg'
  },
  postCount: {
    type: Number,
    default: 0
  },
 FollowerCount: {
    type: Number,
    default: 0
  },
  followingCount: {
    type: Number,
    default: 0
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Hash password before saving (only if password exists and is modified)
userSchema.pre('save', async function (next) {
  if (this.password && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// CRITICAL FIX: DO NOT use schema.index() for fields already marked as unique above
// Remove any lines like these if they exist in your original file:
// userSchema.index({ username: 1 }, { unique: true });
// userSchema.index({ githubId: 1 }, { unique: true });
// They cause the "Duplicate schema index" warning!

module.exports = mongoose.model('User', userSchema);
