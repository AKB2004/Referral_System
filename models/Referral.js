const mongoose = require('mongoose');

const ReferralSchema = new mongoose.Schema({
  referredCustomerName: {
    type: String,
    required: [true, 'Please provide the referred customer name'],
    trim: true
  },
  referredCustomerEmail: {
    type: String,
    required: [true, 'Please provide the referred customer email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  referrer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Referrer',
    required: true
  },
  campaign: {
    type: mongoose.Schema.ObjectId,
    ref: 'Campaign',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  purchaseValue: {
    type: Number,
    default: 0
  },
  reward: {
    type: String
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Declined'],
    default: 'Pending'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Referral', ReferralSchema);