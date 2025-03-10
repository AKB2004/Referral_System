const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a campaign name'],
    trim: true,
    maxlength: [100, 'Campaign name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a campaign description']
  },
  rewardType: {
    type: String,
    required: [true, 'Please provide a reward type'],
    enum: ['Discount', 'Credit', 'Free Product', 'Other']
  },
  rewardDetails: {
    type: String,
    required: [true, 'Please provide reward details']
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide a start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide an end date']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Campaign', CampaignSchema);