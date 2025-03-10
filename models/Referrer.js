const mongoose = require('mongoose');

const ReferrerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a referrer name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  campaign: {
    type: mongoose.Schema.ObjectId,
    ref: 'Campaign',
    required: true
  },
  referralCode: {
    type: String,
    unique: true
  },
  signupDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Active', 'Pending', 'Inactive'],
    default: 'Active'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Generate referral code before saving
ReferrerSchema.pre('save', function(next) {
  if (!this.referralCode) {
    // Generate a random code of 8 characters
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    this.referralCode = result;
  }
  next();
});

// Reverse populate with referrals
ReferrerSchema.virtual('referrals', {
  ref: 'Referral',
  localField: '_id',
  foreignField: 'referrer',
  justOne: false
});

module.exports = mongoose.model('Referrer', ReferrerSchema);